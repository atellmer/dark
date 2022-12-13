import { requestIdleCallback } from '@shopify/jest-dom-mocks';

import { REPLACER } from '@dark-engine/core/constants';

const dom = (strings: TemplateStringsArray, ...args: Array<string | number | boolean>) => {
  const markup = strings
    .map((x, idx) => x + (typeof args[idx] !== 'undefined' ? args[idx] : ''))
    .join('')
    .replace(/\s*(?=\<).*?\s*/gm, '')
    .trim();

  return markup;
};

const waitNextIdle = () => requestIdleCallback.runIdleCallbacks();

const waitNextTick = () => Promise.resolve();

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

export { dom, waitNextIdle, waitNextTick, createReplacerString, createTestHostNode, fireEvent, click, setInputValue };
