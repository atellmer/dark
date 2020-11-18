import { requestIdleCallback } from '@shopify/jest-dom-mocks';


const dom = (strings: TemplateStringsArray, ...args: Array<string | number>) => {
  const markup =  strings
    .map((x, idx) => x + (typeof args[idx] !== 'undefined' ? args[idx] : ''))
    .join('')
    .replace(/\s*(?=\<).*?\s*/gm, '')
    .trim();

  return markup;
}

const waitNextIdle = () => requestIdleCallback.runIdleCallbacks();

export {
  dom,
  waitNextIdle,
};
