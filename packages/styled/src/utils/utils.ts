import { STYLE_TAG, BLANK_SPACE } from '../constants';

const uniq = <T>(items: Array<T>, selector: (x: T) => unknown = x => x) => {
  const arr: Array<T> = [];
  const set = new Set();

  for (const item of items) {
    const key = selector(item);

    !set.has(key) && arr.push(item);
    set.add(key);
  }

  return arr;
};

const mapProps = <T extends object>(props: T) => Object.keys(props).map(key => props[key]);

const mergeClassNames = (classNames: Array<string>) => uniq(classNames.filter(Boolean)).join(BLANK_SPACE);

const getElement = (selector: string) => document.querySelector(selector);

const getElements = (selector: string) => Array.from(document.querySelectorAll(selector));

const createStyleElement = () => document.createElement(STYLE_TAG);

const setAttr = (element: Element, attrName: string, attrValue: string) => element.setAttribute(attrName, attrValue);

const append = (parent: Element, element: Element) => parent.appendChild(element);

const insertBefore = (parent: Element, element: Element, sibling: Element) => parent.insertBefore(element, sibling);

const mergeTemplates = (t1: TemplateStringsArray, t2: TemplateStringsArray) => {
  const [first] = t2;
  const $t1 = [...t1];
  const $t2: Array<string> = [];
  let result: Omit<TemplateStringsArray, 'raw'> = null;

  for (let i = 0; i < t2.length; i++) {
    if (i > 0) {
      $t2.push(t2[i]);
    }
  }

  $t1[$t1.length - 1] = $t1[$t1.length - 1] + first;
  result = [...$t1, ...$t2];

  Object.assign(result, { raw: result });

  return result as TemplateStringsArray;
};

const detectIsBrowser = () => typeof globalThis.window !== 'undefined';

export {
  uniq,
  mapProps,
  mergeClassNames,
  getElement,
  getElements,
  createStyleElement,
  setAttr,
  append,
  insertBefore,
  mergeTemplates,
  detectIsBrowser,
};
