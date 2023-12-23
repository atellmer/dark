import { Readable } from 'node:stream';
import {
  type DarkElement,
  type Callback,
  ROOT,
  Fiber,
  CREATE_EFFECT_TAG,
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
  isStream?: boolean;
  onCompleted: Callback;
  onStart?: Callback;
};

function scheduleRender(options: ScheduleRenderOptions) {
  !isInjected && inject();
  const { element, isStream = false, onCompleted, onStart = dummyFn } = options;
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

    $scope.setIsStreamZone(isStream);
    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setNextUnitOfWork(fiber);

    onStart();
    emitter.on('finish', () => {
      emitter.kill();
      onCompleted();
    });
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL, forceAsync: true });
}

function renderToString(element: DarkElement): Promise<string> {
  return new Promise<string>(resolve => {
    const onCompleted = () => {
      const rootId = getRootId();
      const { element: nativeElement } = $$scope().getRoot() as Fiber<TagNativeElement>;
      const content = nativeElement.renderToString(true);

      resolve(content);
      unmountRoot(rootId, () => {});
    };

    scheduleRender({ element, onCompleted });
  });
}

type RenderToStreamOptions = {
  bootstrapScripts?: Array<string>;
  chunkSize?: number;
};

function renderToStream(element: DarkElement, options?: RenderToStreamOptions): Readable {
  const { bootstrapScripts = [], chunkSize = 500 } = options || {};
  const stream = new Readable({ encoding: 'utf-8', read() {} });
  let content = '';

  const onCompleted = () => {
    const rootId = getRootId();

    if (content) {
      stream.push(content);
      content = '';
    }

    stream.push(null);
    unmountRoot(rootId, () => {});
  };

  const onStart = () => {
    const emitter = $$scope().getEmitter();

    emitter.on<string>('chunk', chunk => {
      if (chunk === PREPEND_SCRIPTS_CHUNK) {
        content += addScripts(bootstrapScripts);
      }

      content += chunk;

      if (content.length >= chunkSize) {
        stream.push(content);
        content = '';
      }
    });
  };

  nextTick(() => scheduleRender({ element, isStream: true, onCompleted, onStart }));
  stream.push(DOCTYPE);

  return stream;
}

function addScripts(scripts: Array<string>) {
  if (scripts.length === 0) return '';
  let content = '';

  scripts.forEach(script => {
    content += `<script src="${script}" defer></script>`;
  });

  return content;
}

const PREPEND_SCRIPTS_CHUNK = '</body>';
const DOCTYPE = '<!DOCTYPE html>';

const getNextRootId = () => ++nextRootId;

export { renderToString, renderToStream, inject };
