import * as core from '@dark-engine/core';
import { platform, REPLACER } from '@dark-engine/core';
import { createRoot, inject as injectBrowserSupport } from '@dark-engine/platform-browser';
import { renderToStream, renderToString, inject as injectServerSupport } from '@dark-engine/platform-server';

import { STYLED_ATTR, GLOBAL_ATTR_VALUE, COMPONENTS_ATTR_VALUE } from '@dark-engine/styled/constants';

jest.mock('@dark-engine/core', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@dark-engine/core'),
  };
});

const dom = (strings: TemplateStringsArray, ...args: Array<string | number | boolean>) => {
  const markup = strings
    .map((x, idx) => x + (typeof args[idx] !== 'undefined' ? args[idx] : ''))
    .join('')
    .replace(/\s*(?=\<).*?\s*/gm, '')
    .trim();

  return markup;
};

const createReplacerString = () => `<!--${REPLACER}-->`;

const createTestHostNode = () => document.createElement('div');

const fireEvent = (element: Element, eventName: string, value?: any) => {
  if (element instanceof HTMLInputElement && eventName === 'input') {
    element.value = value;
  }

  const event = new Event(eventName, {
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);
};

const click = (element: Element) => fireEvent(element, 'click');

const setInputValue = (element: HTMLInputElement, value: string) => fireEvent(element, 'input', value);

const sleep = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));

const nextTick = () => new Promise(resolve => process.nextTick(resolve));

const getSpyLength = (x: jest.Mock) => x.mock.calls.length;

const time = () => Date.now();

const replacer = createReplacerString();

let host: HTMLElement = null;
let root: ReturnType<typeof createRoot> = null;

function createBrowserEnv() {
  injectBrowserSupport();
  mockBrowserPlatform();
  root && root.unmount();
  host && host.parentElement === document.body && document.body.removeChild(host);
  host = createTestHostNode();
  root = createRoot(host);
  const render = root.render;

  document.body.appendChild(host);

  return {
    host,
    root,
    render,
    addEventListener,
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
  jest.spyOn(core, 'nextTick').mockImplementation(cb => setTimeout(cb));
  jest.spyOn(platform, 'raf').mockImplementation((cb: FrameRequestCallback) => setTimeout(cb, 16));
  jest.spyOn(platform, 'caf').mockImplementation((id: number) => clearTimeout(id));
  jest.spyOn(platform, 'spawn').mockImplementation(cb => setTimeout(cb));
}

const wrapWithGlobalStyledTag = (x: string) => `<style ${STYLED_ATTR}="${GLOBAL_ATTR_VALUE}">${x}</style>`;

const wrapWithStyledTag = (x: string) => `<style ${STYLED_ATTR}="${COMPONENTS_ATTR_VALUE}">${x}</style>`;

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
  createServerEnv,
  mockBrowserPlatform,
  wrapWithGlobalStyledTag,
  wrapWithStyledTag,
};
