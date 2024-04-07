import { Readable } from 'node:stream';
import {
  type DarkElement,
  type Callback,
  type CallbackWithValue,
  type AppResource,
  ROOT,
  Fiber,
  CREATE_EFFECT_TAG,
  STATE_SCRIPT_TYPE,
  TaskPriority,
  platform,
  flatten,
  TagVirtualNode,
  createReplacer,
  unmountRoot,
  setRootId,
  getRootId,
  $$scope,
  nextTick,
  dummyFn,
  falseFn,
  scheduler,
} from '@dark-engine/core';

import { createNativeElement, commit, finishCommit, chunk } from '../dom';
import { TagNativeElement } from '../native-element';
import { DOCTYPE } from '../constants';

const spawn = nextTick; // !
let nextRootId = -1;
let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.raf = dummyFn as unknown as typeof platform.raf;
  platform.caf = dummyFn;
  platform.spawn = spawn;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = falseFn;
  platform.detectIsPortal = falseFn;
  platform.unmountPortal = dummyFn;
  platform.chunk = chunk;
  isInjected = true;
}

type ScheduleRenderOptions = {
  element: DarkElement;
  onStart: Callback;
  onError: CallbackWithValue<string>;
  onCompleted: Callback;
};

function scheduleRender(options: ScheduleRenderOptions) {
  !isInjected && inject();
  const { element, onCompleted, onError, onStart } = options;
  const rootId = getNextRootId();
  const callback = () => {
    setRootId(rootId);
    const $scope = $$scope();
    const fiber = new Fiber().mutate({
      element: new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      tag: CREATE_EFFECT_TAG,
    });
    const emitter = $scope.getEmitter();

    $scope.setIsStreamZone(true);
    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setNextUnitOfWork(fiber);

    onStart();
    emitter.on('finish', () => {
      emitter.kill();
      onCompleted();
    });
    emitter.on<string>('error', err => {
      emitter.kill();
      onError(err);
    });
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL, forceAsync: true });
}

type RenderToStreamOptions = {
  bootstrapScripts?: Array<string>;
  bootstrapModules?: Array<string>;
  chunkSize?: number;
};

function renderToReadableStream(element: DarkElement, options?: RenderToStreamOptions): Readable {
  const { bootstrapScripts = [], bootstrapModules = [], chunkSize = 500 } = options || {};
  const stream = new Readable({ encoding: 'utf-8', read() {} });
  let content = '';

  const onStart = () => {
    const emitter = $$scope().getEmitter();

    emitter.on<string>('chunk', chunk => {
      if (chunk === PREPEND_SCRIPTS_CHUNK && (bootstrapScripts.length > 0 || bootstrapModules.length > 0)) {
        content += addScripts(bootstrapScripts, false);
        content += addScripts(bootstrapModules, true);
      }

      content += chunk;

      if (content.length >= chunkSize) {
        stream.push(content);
        content = '';
      }
    });
  };

  const onCompleted = () => {
    const rootId = getRootId();

    if (content) {
      stream.push(content);
      content = '';
    }

    stream.push(withState());
    stream.push(null);
    unmountRoot(rootId, dummyFn);
  };

  const onError = (err: string) => {
    const rootId = getRootId();

    stream.emit('error', new Error(err));
    stream.push(null);
    unmountRoot(rootId, dummyFn);
  };

  scheduleRender({ element, onStart, onCompleted, onError });

  return stream;
}

function renderToString(element: DarkElement): Promise<string> {
  return convertStreamToPromise(renderToReadableStream(element));
}

function renderToStream(element: DarkElement, options?: RenderToStreamOptions): Readable {
  const stream = renderToReadableStream(element, options);

  stream.push(DOCTYPE);

  return stream;
}

function convertStreamToPromise(stream: Readable) {
  return new Promise<string>((resolve, reject) => {
    let data = '';

    stream.on('data', chunk => (data += chunk));
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
}

function addScripts(scripts: Array<string>, isModule: boolean) {
  if (scripts.length === 0) return '';
  let content = '';

  scripts.forEach(x => (content += isModule ? createModule(x) : createScript(x)));

  return content;
}

function withState(content = '') {
  const $scope = $$scope();
  const state = $scope.getResources();
  const resources: Record<string, AppResource> = {};

  if (state.size === 0) return content;
  state.forEach((value, key) => (resources[key] = value));
  const encoded = Buffer.from(JSON.stringify(resources)).toString('base64');
  const $content = `${content}<script type="${STATE_SCRIPT_TYPE}">"${encoded}"</script>`;

  return $content;
}

const createModule = (src: string) => `<script type="module" src="${src}" defer></script>`;

const createScript = (src: string) => `<script src="${src}" defer></script>`;

const getNextRootId = () => ++nextRootId;

const PREPEND_SCRIPTS_CHUNK = '</body>';

export { renderToString, renderToStream, convertStreamToPromise, inject };
