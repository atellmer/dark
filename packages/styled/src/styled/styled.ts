import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  View,
  component,
  useMemo,
  detectIsString,
  detectIsFunction,
  detectIsUndefined,
  detectIsTextBased,
  useInsertionEffect,
  detectIsServer,
} from '@dark-engine/core';

import { FUNCTION_MARK } from '../constants';
import { parse } from '../parse';
import { StyleSheet } from '../tokens';

let styles = new Map<string, string>();
let tag: HTMLStyleElement = null;
let nextId = -1;

function createStyledComponent<P extends object>(factory: ComponentFactory | ((props: P) => TagVirtualNodeFactory)) {
  return (strings: TemplateStringsArray, ...args: Args<P>) => {
    let updates: Array<string> = [];
    const fns = args.filter(x => detectIsFunction(x)) as DynamicArgs<P>;
    const [$static, $dynamics] = slice(parse(join(strings, args)));
    const className = generate($static, updates);
    const $factory = component<P>(props => {
      const values = Object.keys(props).map(key => props[key]);
      const $className = useMemo(() => {
        return $dynamics.map(x => generate(x, updates, props, fns)).join(' ');
      }, [...values]);
      const $$className = $className ? `${className} ${$className}` : className;

      useInsertionEffect(() => {
        if (!tag) {
          tag = document.createElement('style');
          tag.setAttribute('dark-styled', 'true');
          document.head.appendChild(tag);
        }

        updates.forEach(x => inject(x));
        updates = [];
      }, [updates.length]);

      if (detectIsServer()) {
        styles = new Map();
        updates = [];
      }

      return factory({ ...props, class: $$className });
    });

    return $factory;
  };
}

function styled<P extends object>(tag: string | ComponentFactory) {
  return detectIsString(tag)
    ? createStyledComponent<P>((props: P) => View({ as: tag, ...props }))
    : createStyledComponent<P>(tag);
}

function generate<P extends object>(stylesheet: StyleSheet, updates: Array<string>, props?: P, fns?: Array<Function>) {
  const key = stylesheet.generate(FUNCTION_MARK, props, fns);
  const className = styles.has(key) ? styles.get(key) : genClassName();
  const css = key.replaceAll(FUNCTION_MARK, className);

  if (!styles.has(key)) {
    updates.push(css);
    styles.set(key, className);
  }

  return className;
}

function inject(css: string) {
  tag.textContent = `${tag.textContent}${css}`;
}

function genClassName() {
  return `dk-${++nextId}`;
}

function slice(source: StyleSheet): [StyleSheet, Array<StyleSheet>] {
  const $static = new StyleSheet();
  const $dynamics: Array<StyleSheet> = [];

  for (const token of source.children) {
    if (token.isDynamic) {
      const style = new StyleSheet();

      style.children.push(token);
      $dynamics.push(style);
    } else {
      $static.children.push(token);
    }
  }

  return [$static, $dynamics];
}

function join<P>(strings: TemplateStringsArray, args: Args<P>) {
  let joined = '';

  for (let i = 0; i < strings.length; i++) {
    joined += strings[i];

    if (detectIsFunction(args[i])) {
      joined += FUNCTION_MARK;
    } else if (detectIsTextBased(args[i])) {
      joined += args[i];
    }
  }

  return joined;
}

function css(strings: TemplateStringsArray, ...args: Args<any>) {
  return strings
    .map((x, idx) => x + (!detectIsUndefined(args[idx]) ? args[idx] : ''))
    .join('')
    .replace(/([:;])\s*/gm, '$1')
    .trim();
}

type TextBased = string | number;

type ArgFn<P> = (p: P) => TextBased | false;

type DynamicArgs<P> = Array<ArgFn<P>>;

type Args<P> = Array<TextBased | ArgFn<P>>;

export { styled, css };
