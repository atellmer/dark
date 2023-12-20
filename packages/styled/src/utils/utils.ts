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

const createStyleElement = () => document.createElement(STYLE_TAG);

const setAttr = (element: Element, attrName: string, attrValue: string) => element.setAttribute(attrName, attrValue);

const append = (parent: Element, element: Element) => parent.appendChild(element);

export { uniq, mapProps, mergeClassNames, getElement, createStyleElement, setAttr, append };
