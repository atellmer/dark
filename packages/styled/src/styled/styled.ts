import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type StandardComponentProps,
  View,
  component,
  useMemo,
  detectIsString,
  detectIsFunction,
  detectIsUndefined,
  detectIsTextBased,
  useInsertionEffect,
  detectIsServer,
  forwardRef,
} from '@dark-engine/core';

import { FUNCTION_MARK } from '../constants';
import { parse } from '../parse';
import { StyleSheet } from '../tokens';
import { hash } from '../hash';

let styles = new Map<string, [string, string]>();
let tag: HTMLStyleElement = null;

function createStyledComponent<P extends StyledProps, R extends unknown>(
  factory: ComponentFactory<P, R> | ((props: P) => TagVirtualNodeFactory),
) {
  let transformProps: TransformProps<P> = x => x;
  const fn: Fn<P, R> = (strings: TemplateStringsArray, ...args: Args<P>) => {
    let isParsed = false;
    let updates: Array<string> = [];
    let fns: Array<Function> = [];
    let $static: StyleSheet = null;
    let $dynamics: Array<StyleSheet> = [];
    let className = '';
    const $factory = forwardRef<P, R>(
      component((props, ref) => {
        if (!isParsed) {
          fns = args.filter(x => detectIsFunction(x)) as DynamicArgs<P>;
          [$static, $dynamics] = slice(parse(join(strings, args)));
          className = generate($static, updates);
          isParsed = true;
        }

        const values = Object.keys(props).map(key => props[key]);
        const $className = useMemo(() => {
          return $dynamics.map(x => generate(x, updates, props, fns)).join(' ');
        }, [...values]);
        const $$className = $className ? `${className} ${$className}` : className;
        const $$$className = getClassName(props);
        const $$$$className = $$$className ? `${$$$className} ${$$className}` : $$className;

        useInsertionEffect(() => {
          if (!tag) {
            tag = document.createElement('style');
            tag.setAttribute('dark-styled', 'true');
            document.head.appendChild(tag);
          }

          updates.forEach(x => inject(x));
          updates = [];
        }, [updates.join('')]);

        if (detectIsServer()) {
          styles = new Map();
          updates = [];
        }

        return factory({ ...transformProps(props), ref, class: $$$$className });
      }),
    );

    return $factory as StyledComponentFactory<P, R>;
  };

  fn.attrs = (t: TransformProps<P>) => {
    transformProps = detectIsFunction(t) ? t : transformProps;

    return fn;
  };

  return fn;
}

function styled<P extends object, R = unknown>(tag: string | ComponentFactory<P, R>) {
  return createStyledComponent<P, R>(detectIsString(tag) ? (props: P) => View({ as: tag, ...props }) : tag);
}

const getClassName = (props: StyledProps) => props.class || props.className;

function generate<P extends object>(stylesheet: StyleSheet, updates: Array<string>, props?: P, fns?: Array<Function>) {
  const key = stylesheet.generate(FUNCTION_MARK, props, fns);
  const style = styles.get(key);
  const className = style ? style[0] : genClassName(key);
  const css = style ? style[1] : key.replaceAll(FUNCTION_MARK, className);

  if (!style) {
    updates.push(css);
    styles.set(key, [className, css]);
  }

  return className;
}

function inject(css: string) {
  tag.textContent = `${tag.textContent}${css}`;
}

function genClassName(key: string) {
  return `dk-${hash(key)}`;
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

type StyledProps<P = unknown, R = unknown> = {
  as?: string | ComponentFactory<P, R>;
  className?: string;
  class?: string;
};

type StyledComponentFactory<P, R> = ComponentFactory<P & StandardComponentProps & StyledProps<P, R>, R>;

type TransformProps<P> = (p: P) => any;

type Fn<P, R> = {
  (strings: TemplateStringsArray, ...args: Args<P>): StyledComponentFactory<P, R>;
  attrs: (t: TransformProps<P>) => Fn<P, R>;
};

type TextBased = string | number;

type ArgFn<P> = (p: P) => TextBased | false;

type DynamicArgs<P> = Array<ArgFn<P>>;

type Args<P> = Array<TextBased | ArgFn<P>>;

export { styled, css };
