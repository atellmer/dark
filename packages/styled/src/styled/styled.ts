import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type StandardComponentProps,
  View,
  component,
  useMemo,
  detectIsString,
  detectIsFunction,
  detectIsTextBased,
  detectIsServer,
  useInsertionEffect,
  forwardRef,
} from '@dark-engine/core';

import { type DefaultTheme } from '../';
import {
  CLASS_NAME_PREFIX,
  FUNCTION_MARK,
  CLASS_NAME_MARK,
  STYLED_ATTR,
  CLASS_NAME_DELIMETER_MARK,
} from '../constants';
import { parse } from '../parse';
import { StyleSheet } from '../tokens';
import { hash } from '../hash';
import { useThemeContext } from '../context';
import { uniq } from '../utils';

let styles = new Map<string, [string, string]>();
let styleTag: HTMLStyleElement = null;
const $$styled = Symbol('styled');

function createStyledComponent<P extends StyledProps, R extends unknown>(
  factory: ComponentFactory<P, R> | ((props: P) => TagVirtualNodeFactory),
  tagName: string | ComponentFactory<P, R>,
) {
  let transformProps: TransformProps<P> = x => x;
  let updates: Array<string> = [];
  const fn: Fn<P, R> = (strings: TemplateStringsArray, ...args: Args<P>) => {
    const fns = args.filter(x => detectIsFunction(x) && !detectIsStyled(x)) as DynamicArgs<P>;
    const [$static, $dynamics] = slice(parse(join(strings, args)));
    const className = generate({ stylesheet: $static, updates });
    const $factory = forwardRef<P, R>(
      component((props, ref) => {
        const { as: $factory, ...rest } = props;
        const { theme } = useThemeContext();
        const values = Object.keys(props).map(key => props[key]);
        const isReplace = detectIsFunction($factory) && detectIsString(tagName);
        const $props = (isReplace ? rest : props) as unknown as P;
        const $$factory = isReplace ? $factory : factory;
        const $className = useMemo(() => {
          const $props = { ...props, theme };
          const dynamicNames = $dynamics.map(x => generate({ stylesheet: x, props: $props, updates, fns }));

          return uniq([...getClassNamesFrom(props), className, ...dynamicNames].filter(Boolean)).join(
            CLASS_NAME_DELIMETER_MARK,
          );
        }, [...values, theme]);

        useInsertionEffect(() => {
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.setAttribute(STYLED_ATTR, 'true');
            document.head.appendChild(styleTag);
          }

          updates.forEach(x => inject(x, styleTag));
          updates = [];
        }, [updates.join('')]);

        if (detectIsServer()) {
          styles = new Map();
          updates = [];
        }

        return $$factory({ ...transformProps($props), ref, class: $className });
      }),
    );

    $factory[$$styled] = { className };

    return $factory as StyledComponentFactory<P, R>;
  };

  fn.attrs = (t: TransformProps<P>) => {
    transformProps = detectIsFunction(t) ? t : transformProps;

    return fn;
  };

  return fn;
}

function styled<P extends object, R = unknown>(tagName: string | ComponentFactory<P, R>) {
  const factory = detectIsString(tagName) ? (props: P) => View({ as: tagName, ...props }) : tagName;

  return createStyledComponent<P, R>(factory, tagName);
}

const getClassNamesFrom = (props: StyledProps) => {
  const className = props.class || props.className || '';

  return className.split(CLASS_NAME_DELIMETER_MARK);
};

type GenerateOptions<P extends object> = {
  stylesheet: StyleSheet;
  updates: Array<string>;
  props?: P;
  fns?: Array<Function>;
};

function generate<P extends object>(options: GenerateOptions<P>) {
  const { stylesheet, updates, props, fns } = options;
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

function inject(css: string, tag: HTMLStyleElement) {
  tag.textContent = `${tag.textContent}${css}`;
}

function genClassName(key: string) {
  return `${CLASS_NAME_PREFIX}-${hash(key)}`;
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

    if (detectIsStyled(args[i])) {
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
  return parse(join(strings, args));
}

const detectIsStyled = <P, R>(x: unknown): x is StyledComponentFactory<P, R> =>
  detectIsFunction(x) && Boolean(x[$$styled]);

type StyledProps = {
  as?: string | ComponentFactory;
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

export type DynamicArgs<P> = Array<ArgFn<P>>;

export type Args<P> = Array<TextBased | ArgFn<P> | Function>;

export { styled, css, slice, join, detectIsStyled };
