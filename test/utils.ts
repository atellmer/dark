import * as core from '@dark-engine/core';
import { type DarkElement, platform, REPLACER } from '@dark-engine/core';
import { createRoot, hydrateRoot, inject as injectBrowserSupport } from '@dark-engine/platform-browser';
import { renderToStream, renderToString, inject as injectServerSupport } from '@dark-engine/platform-server';
import { STYLED_ATTR, GLOBAL_ATTR_VALUE, COMPONENTS_ATTR_VALUE } from '@dark-engine/styled/constants';

jest.mock('@dark-engine/core', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@dark-engine/core'),
  };
});

function dom(strings: TemplateStringsArray, ...args: Array<string | number | boolean>) {
  const markup = strings
    .map((x, idx) => x + (typeof args[idx] !== 'undefined' ? args[idx] : ''))
    .join('')
    .replace(/\s*(?=\<).*?\s*/gm, '')
    .trim();

  return markup;
}

const createReplacerString = () => `<!--${REPLACER}-->`;

const createTestHostNode = () => document.createElement('div');

function fireEvent(element: Element, eventName: string, value?: any) {
  if (element instanceof HTMLInputElement && eventName === 'input') {
    element.value = value;
  }

  const event = new Event(eventName, {
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);
}

const click = (element: Element) => fireEvent(element, 'click');

const setInputValue = (element: HTMLInputElement, value: string) => fireEvent(element, 'input', value);

const sleep = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));

const nextTick = () => new Promise(resolve => process.nextTick(resolve));

const getSpyLength = (x: jest.Mock) => x.mock.calls.length;

const time = () => Date.now();

const replacer = createReplacerString();

let host: HTMLElement = null;
let unmount: Function = null;

function setupBrowserEnv() {
  injectBrowserSupport();
  mockBrowserPlatform();
  unmount && unmount();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  host = createTestHostNode();
}

function createBrowserEnv() {
  setupBrowserEnv();
  const root = createRoot(host);
  const render = root.render;

  unmount = root.unmount;
  document.body.appendChild(host);

  return {
    host,
    unmount,
    render,
  };
}

type CreateBrowserHydrateEnvOptions = {
  useDocument?: boolean;
  headHTML?: string;
  bodyHTML?: string;
};

function createBrowserHydrateEnv(options: CreateBrowserHydrateEnvOptions) {
  const { useDocument, headHTML = '', bodyHTML = '' } = options;
  const { head, body } = document;
  setupBrowserEnv();
  const hydrate = (app: DarkElement) => ({ unmount } = hydrateRoot(useDocument ? document : body, app));

  head.innerHTML = headHTML;
  body.innerHTML = bodyHTML;

  return {
    unmount,
    hydrate,
    head,
    body,
  };
}

function createServerEnv() {
  injectServerSupport();

  return {
    renderToString,
    renderToStream,
  };
}

function mockBrowserPlatform() {
  jest.spyOn(core, 'nextTick').mockImplementation(cb => {
    setTimeout(cb);
    return Promise.resolve();
  });
  jest.spyOn(platform, 'raf').mockImplementation((cb: FrameRequestCallback) => setTimeout(cb, 16));
  jest.spyOn(platform, 'caf').mockImplementation((id: number) => clearTimeout(id));
  jest.spyOn(platform, 'spawn').mockImplementation(cb => setTimeout(cb));
}

const wrapWithGlobalStyledTag = (x: string) => `<style ${STYLED_ATTR}="${GLOBAL_ATTR_VALUE}">${x}</style>`;

const wrapWithStyledTag = (x: string) => `<style ${STYLED_ATTR}="${COMPONENTS_ATTR_VALUE}">${x}</style>`;

const resetBrowserHistory = () => globalThis.history.replaceState(null, null, '/');

function detectIsFakeJestTimer() {
  return setTimeout.name === 'setTimeout';
}

async function waitUntilEffectsStart() {
  if (detectIsFakeJestTimer()) {
    jest.runAllTimers();
  } else {
    await sleep(0);
  }
}

export {
  dom,
  nextTick,
  createReplacerString,
  createTestHostNode,
  fireEvent,
  click,
  setInputValue,
  getSpyLength,
  sleep,
  time,
  replacer,
  createBrowserEnv,
  createBrowserHydrateEnv,
  createServerEnv,
  mockBrowserPlatform,
  wrapWithGlobalStyledTag,
  wrapWithStyledTag,
  resetBrowserHistory,
  waitUntilEffectsStart,
};
