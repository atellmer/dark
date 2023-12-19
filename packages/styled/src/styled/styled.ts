import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type StandardComponentProps,
  View,
  component,
  forwardRef,
  useMemo,
  detectIsString,
  detectIsFunction,
  detectIsTextBased,
  detectIsServer,
  useInsertionEffect,
} from '@dark-engine/core';

import {
  CLASS_NAME_PREFIX,
  FUNCTION_MARK,
  CLASS_NAME_MARK,
  STYLED_COMPONENTS_ATTR,
  CLASS_NAME_DELIMETER,
} from '../constants';
import { type KeyframesExp, StyleSheet, detectIsKeyframesExp } from '../tokens';
import { mapProps, mergeClassNames, getElement, createStyleElement, setAttr, append } from '../utils';
import { type Keyframes, detectIsKeyframes } from '../keyframes';
import { useTheme } from '../theme';
import { useManager } from '../manager';
import { type TextBased } from '../shared';
import { type DefaultTheme } from '../';
import { parse } from '../parse';
import { hash } from '../hash';

let styles = new Map<string, [string, string]>();
let tag: HTMLStyleElement = null;
const $$styled = Symbol('styled');

function styled<P extends object, R = unknown>(tagName: string | ComponentFactory<P, R>) {
  const factory = detectIsString(tagName) ? (props: P) => View({ as: tagName, ...props }) : tagName;

  return createStyledComponent<P, R>(factory, tagName);
}

function createStyledComponent<P extends StyledProps, R extends unknown>(
  factory: ComponentFactory<P, R> | ((props: P) => TagVirtualNodeFactory),
  tagName: string | ComponentFactory<P, R>,
) {
  let transformProps: TransformProps<P> = x => x;
  let updates: Array<string> = [];
  const fn: Fn<P, R> = (strings: TemplateStringsArray, ...args: Args<P>) => {
    const fns = filterArgs<P>(args);
    const [stylesheet, stylesheets] = slice<P>(css(strings, ...args));
    const className = generate({ stylesheet, updates });
    const styled = forwardRef<P, R>(
      component((props, ref) => {
        const { as: component, ...rest } = props;
        const theme = useTheme();
        const withReplace = detectIsFunction(component) && detectIsString(tagName);
        const $props = (withReplace ? rest : props) as unknown as P;
        const $factory = withReplace ? component : factory;
        const $className = useMemo(() => {
          const classNames = [
            ...getClassNamesFrom(props),
            className,
            ...stylesheets.map(stylesheet => generate({ stylesheet, props: { ...props, theme }, updates, fns })),
          ];

          return mergeClassNames(classNames);
        }, [...mapProps(props), theme]);
        const joined = updates.join('');

        useInsertionEffect(() => {
          if (!tag) {
            const $tag = getTag();

            if ($tag) {
              tag = $tag; // after hydration
              updates = [];
              return;
            } else {
              tag = createTag();
            }
          }

          updates.forEach(x => inject(x, tag));
          updates = [];
        }, [joined]);

        if (detectIsServer()) {
          const manager = useManager(); // special case of hook using, should be last in order

          manager.collectComponentStyle(joined); // ssr
          styles = new Map();
          updates = [];
        }

        return $factory({ ...transformProps($props), ref, class: $className });
      }),
    );

    styled[$$styled] = className;

    return styled as StyledComponentFactory<P, R>;
  };

  fn.attrs = (t: TransformProps<P>) => {
    transformProps = detectIsFunction(t) ? t : transformProps;

    return fn;
  };

  return fn;
}

type GenerateOptions<P extends object> = {
  stylesheet: StyleSheet<P>;
  updates: Array<string>;
  props?: P;
  fns?: Array<Function>;
};

function generate<P extends object>(options: GenerateOptions<P>) {
  const { stylesheet: $stylesheet, updates, props, fns } = options;
  const [stylesheet, keyframes] = split($stylesheet);
  const key = stylesheet.generate({ className: FUNCTION_MARK, props, fns });
  const style = styles.get(key);
  const className = style ? style[0] : genClassName(key);
  const css = style ? style[1] : key.replaceAll(FUNCTION_MARK, className);

  if (!style) {
    updates.push(css);
    styles.set(key, [className, css]);
  }

  for (const token of keyframes) {
    const css = token.generate();

    if (!styles.has(css)) {
      updates.push(css);
      styles.set(css, [token.value, css]);
    }
  }

  return className;
}

function split<P extends object>(source: StyleSheet<P>): [StyleSheet<P>, Array<KeyframesExp<P>>] {
  const stylesheet = new StyleSheet<P>();
  const keyframes: Array<KeyframesExp<P>> = [];

  for (const token of source.children) {
    if (detectIsKeyframesExp(token)) {
      keyframes.push(token);
    } else {
      stylesheet.children.push(token);
    }
  }

  return [stylesheet, keyframes];
}

function slice<P extends object>(source: StyleSheet<P>): [StyleSheet<P>, Array<StyleSheet<P>>] {
  const stylesheet = new StyleSheet<P>();
  const stylesheets: Array<StyleSheet> = [];

  for (const token of source.children) {
    if (token.isDynamic) {
      const style = new StyleSheet<P>();

      style.children.push(token);
      stylesheets.push(style);
    } else {
      stylesheet.children.push(token);
    }
  }

  return [stylesheet, stylesheets];
}

function join<P>(strings: TemplateStringsArray, args: Args<P>) {
  let joined = '';
  let keyframes = '';

  for (let i = 0; i < strings.length; i++) {
    const arg = args[i];

    joined += strings[i];

    if (detectIsStyled(arg)) {
      joined += `${CLASS_NAME_MARK}${arg[$$styled]}`;
    } else if (detectIsKeyframes(arg)) {
      joined += arg.getName();
      keyframes += arg.getToken().generate();
    } else if (detectIsFunction(arg)) {
      joined += FUNCTION_MARK;
    } else if (detectIsTextBased(arg)) {
      joined += arg;
    }
  }

  joined += keyframes;

  return joined;
}

function createTag() {
  const tag = createStyleElement();

  setAttr(tag, STYLED_COMPONENTS_ATTR, 'true');
  append(document.head, tag);

  return tag;
}

const getTag = () => getElement(`[${STYLED_COMPONENTS_ATTR}="true"]`) as HTMLStyleElement;

const css = <P extends object>(strings: TemplateStringsArray, ...args: Args<P>) => parse<P>(join(strings, args));

const getClassNamesFrom = (props: StyledProps) => (props.class || props.className || '').split(CLASS_NAME_DELIMETER);

const inject = (css: string, tag: HTMLStyleElement) => (tag.textContent = `${tag.textContent}${css}`);

const genClassName = (key: string) => `${CLASS_NAME_PREFIX}-${hash(key)}`;

const detectIsStyled = <P, R>(x: unknown): x is StyledComponentFactory<P, R> =>
  detectIsFunction(x) && Boolean(x[$$styled]);

const filterArgs = <P>(args: Args<unknown>) =>
  args.filter(x => detectIsFunction(x) && !detectIsStyled(x)) as DynamicArgs<P>;

type StyledProps = {
  as?: string | ComponentFactory;
  class?: string;
  className?: string;
};

type StyledComponentFactory<P, R> = {
  [$$styled]: string;
} & ComponentFactory<P & StandardComponentProps & StyledProps, R>;

type TransformProps<P> = (p: P) => any;

type Fn<P, R> = {
  (strings: TemplateStringsArray, ...args: Args<P & ThemeProps>): StyledComponentFactory<P, R>;
  attrs: (t: TransformProps<P>) => Fn<P, R>;
};

type ThemeProps = { theme: DefaultTheme };

type DynamicArgs<P> = Array<ArgFn<P>>;

type ArgFn<P> = Function | ((p: P) => TextBased | false);

export type Args<P> = Array<TextBased | ArgFn<P> | Keyframes>;

export { styled, css, inject, filterArgs };
