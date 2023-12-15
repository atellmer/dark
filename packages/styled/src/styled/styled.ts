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

import { type DefaultTheme } from '../';
import { FUNCTION_MARK, CLASS_NAME_MARK } from '../constants';
import { parse } from '../parse';
import { StyleSheet } from '../tokens';
import { hash } from '../hash';
import { useThemeContext } from '../context';

let styles = new Map<string, [string, string]>();
let tag: HTMLStyleElement = null;
const $$styled = Symbol('styled');

function createStyledComponent<P extends StyledProps, R extends unknown>(
  factory: ComponentFactory<P, R> | ((props: P) => TagVirtualNodeFactory),
) {
  let $transformProps: TransformProps<P> = transformProps;
  let updates: Array<string> = [];
  const fn: Fn<P, R> = (strings: TemplateStringsArray, ...args: Args<P>) => {
    const fns = args.filter(x => detectIsFunction(x) && !detectIsStyledComponentFactory(x)) as DynamicArgs<P>;
    const [$static, $dynamics] = slice(parse(join(strings, args)));
    const className = generate($static, updates);
    const $factory = forwardRef<P, R>(
      component((props, ref) => {
        const values = Object.keys(props).map(key => props[key]);
        const { theme } = useThemeContext();
        const classNames = useMemo(() => {
          return $dynamics.map(x => generate(x, updates, { ...props, theme }, fns)).join(' ');
        }, [...values, theme]);
        const $className = [getClassNameFrom(props), className, classNames].filter(Boolean).join(' ');

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

        return factory({ ...$transformProps(props), ref, class: $className });
      }),
    );

    $factory[$$styled] = { className };

    return $factory as StyledComponentFactory<P, R>;
  };

  fn.attrs = (t: TransformProps<P>) => {
    $transformProps = detectIsFunction(t) ? x => transformProps(t(x)) : $transformProps;

    return fn;
  };

  return fn;
}

function styled<P extends object, R = unknown>(tag: string | ComponentFactory<P, R>) {
  const factory = detectIsString(tag) ? (props: P) => View({ as: tag, ...props }) : tag;

  return createStyledComponent<P, R>(factory);
}

const getClassNameFrom = (props: StyledProps) => props.class || props.className;

function transformProps<P extends object>(props: P) {
  const $props = {} as P;
  const keys = Object.keys(props);

  for (const key of keys) {
    if (!key.startsWith('$')) {
      $props[key] = props[key];
    }
  }

  return $props;
}

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

    if (detectIsStyledComponentFactory(args[i])) {
      const factory = args[i] as unknown as StyledComponentFactory<P, unknown>;
      const { className } = factory[$$styled];

      joined += `${CLASS_NAME_MARK}${className}`;
    } else if (detectIsFunction(args[i])) {
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

const detectIsStyledComponentFactory = <P, R>(x: unknown): x is StyledComponentFactory<P, R> =>
  detectIsFunction(x) && Boolean(x[$$styled]);

type StyledProps = {
  as?: string;
  class?: string;
  className?: string;
};

type StyledComponentFactory<P, R> = {
  [$$styled]: {
    className: string;
  };
} & ComponentFactory<P & StandardComponentProps & StyledProps, R>;

type TransformProps<P> = (p: P) => any;

type Fn<P, R> = {
  (strings: TemplateStringsArray, ...args: Args<P & ThemeProps>): StyledComponentFactory<P, R>;
  attrs: (t: TransformProps<P>) => Fn<P, R>;
};

type ThemeProps = { theme: DefaultTheme };

type TextBased = string | number;

type ArgFn<P> = (p: P) => TextBased | false;

type DynamicArgs<P> = Array<ArgFn<P>>;

type Args<P> = Array<TextBased | ArgFn<P> | Function>;

export { styled, css };
