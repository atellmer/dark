import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type Callback,
  component,
  View,
  useMemo,
  detectIsString,
  detectIsFunction,
  detectIsTextBased,
  useInsertionEffect,
} from '@dark-engine/core';

import { REPLACER_MARK } from '../constants';
import { parse } from '../parse';
import { StyleSheet } from '../tokens';

const styles = new Map<string, string>();
let target: HTMLStyleElement = null;
let nextId = -1;
let updates: Array<Callback> = [];

function createStyledComponent<P extends object>(factory: ComponentFactory | ((props: P) => TagVirtualNodeFactory)) {
  return (strings: TemplateStringsArray, ...args: Args<P>) => {
    const fns = args.filter(x => detectIsFunction(x)) as DynamicArgs<P>;
    const joined = join(strings, args);
    const parsed = parse(joined);
    const [$static, $dynamics] = sliceStyleSheet(parsed);
    const key = $static.generate(REPLACER_MARK);
    const className = styles.has(key) ? styles.get(key) : genClassName();
    const css = key.replaceAll(REPLACER_MARK, className);

    if (!styles.has(key)) {
      styles.set(key, className);
      updates.push(() => injectStyles(target, css));
    }

    const $factory = component<P>(props => {
      const values = Object.keys(props).map(key => props[key]);
      const $className = useMemo(() => {
        const classes: Array<string> = [];

        for (const style of $dynamics) {
          const key = style.generate(REPLACER_MARK, props, fns);
          const className = styles.has(key) ? styles.get(key) : genClassName();
          const css = key.replaceAll(REPLACER_MARK, className);

          if (!styles.has(key)) {
            styles.set(key, className);
            updates.push(() => injectStyles(target, css));
          }

          classes.push(className);
        }

        return classes.join(' ');
      }, [...values]);
      const $$className = $className ? `${className} ${$className}` : className;

      useInsertionEffect(() => {
        !target && (target = document.createElement('style'));

        if (updates.length > 0) {
          updates.forEach(x => x());
          updates = [];
        }
      }, [updates.length]);

      return factory({ ...props, class: $$className });
    });

    return $factory;
  };
}

function styled<P extends object>(tag: string | ComponentFactory) {
  return detectIsString(tag)
    ? createStyledComponent<P>((props: P) => View({ ...props, as: tag }))
    : createStyledComponent<P>(tag);
}

function injectStyles(target: HTMLStyleElement, css: string) {
  !target.parentElement && document.head.appendChild(target);
  target.textContent = `${target.textContent}${css}`;
}

function genClassName() {
  return `dk-${++nextId}`;
}

function sliceStyleSheet(source: StyleSheet): [StyleSheet, Array<StyleSheet>] {
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
      joined += REPLACER_MARK;
    } else if (detectIsTextBased(args[i])) {
      joined += args[i];
    }
  }

  return joined;
}

type TextBased = string | number;

type ArgFn<P> = (p: P) => TextBased | false;

type DynamicArgs<P> = Array<ArgFn<P>>;

type Args<P> = Array<TextBased | ArgFn<P>>;

export { styled };
