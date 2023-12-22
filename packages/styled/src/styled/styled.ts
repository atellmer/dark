import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type StandardComponentProps,
  type Component,
  type VirtualNode,
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

import { mapProps, mergeClassNames, getElement, createStyleElement, setAttr, append, mergeTemplates } from '../utils';
import { CLASS_NAME_PREFIX, FUNCTION_MARK, DOT_MARK, STYLED_COMPONENTS_ATTR, BLANK_SPACE } from '../constants';
import { type KeyframesRule, StyleSheet, detectIsKeyframesRule } from '../tokens';
import { type Keyframes, detectIsKeyframes } from '../keyframes';
import { type ThemeProps, useTheme } from '../theme';
import { type TextBased } from '../shared';
import { useManager } from '../manager';
import { parse } from '../parse';
import { hash } from '../hash';

let cache: Map<string, [string, string]> = null;
let injections: Set<string> = null;
let tag: HTMLStyleElement = null;
const $$styled = Symbol('styled');

setupGlobal();

function styled<P extends object, P1 extends object = {}>(tagName: string | ComponentFactory<P>) {
  const factory = detectIsString(tagName) ? (props: P) => View({ as: tagName, ...props }) : tagName;

  return createStyledComponent<P & P1>(factory as Factory<P & P1>);
}

function createStyledComponent<P extends StyledProps>(factory: Factory<P>) {
  let transformProps: TransformProps<P> = x => x;
  const isExtending = detectIsStyled(factory);
  const config = isExtending ? getExtendingConfig(factory as StyledComponentFactory<P>) : null;
  const fn: Fn<P> = (source: TemplateStringsArray, ...args: Args<P>) => {
    const $source = isExtending ? mergeTemplates(config.source, source) : source;
    const $args = isExtending ? [...config.args, ...args] : args;
    const fns = filterArgs<P>($args);
    const [sheet, sheets] = slice<P>(css($source, ...$args));
    const [baseName, base] = generate({ sheet });
    const styled = forwardRef<P, unknown>(
      component((props, ref) => {
        const { as: component, ...rest } = props;
        const theme = useTheme();
        const withReplace = detectIsFunction(component);
        const $props = (withReplace ? rest : props) as unknown as P;
        const $factory = withReplace ? component : isExtending ? config.factory : factory;
        const [className, styles] = useMemo(() => {
          const names: Array<string> = [];
          const styles: Array<string> = [base];

          for (const sheet of sheets) {
            const [className, css] = generate({ sheet, props: { ...props, theme }, fns });

            names.push(className);
            styles.push(css);
          }

          const className = mergeClassNames([...getClassNamesFrom(props), baseName, ...names]);

          return [className, styles];
        }, [...mapProps(props), theme]);

        useInsertionEffect(() => {
          if (!tag) {
            const $tag = getTag();

            if ($tag) {
              tag = $tag; // after hydration
              return;
            } else {
              tag = createTag();
            }
          }

          for (const css of styles) {
            if (!injections.has(css)) {
              inject(css, tag);
              injections.add(css);
            }
          }
        }, [...styles]);

        if (detectIsServer()) {
          const manager = useManager(); // special case of hook using, should be last in order

          styles.forEach(css => manager.collectComponentStyle(css));
          manager.reset(setupGlobal);
        }

        if (detectIsFunction($props.slot)) {
          $props.slot = $props.slot((x: string) => `${baseName}_${x}`);
        }

        return $factory({ ...transformProps($props), ref, class: className });
      }),
    ) as StyledComponentFactory<P>;

    styled[$$styled] = {
      className: baseName,
      source: $source,
      args: $args,
      factory: config?.factory || factory,
    };

    return styled;
  };

  fn.attrs = (t: TransformProps<P>) => {
    transformProps = detectIsFunction(t) ? t : transformProps;

    return fn;
  };

  return fn;
}

function setupGlobal() {
  cache = new Map();
  injections = new Set();
  tag = null;
}

function getExtendingConfig<P extends object>(factory: StyledComponentFactory<P>) {
  const { className, ...rest } = factory[$$styled];
  const config: ExtendingConfig<P> = rest;

  return config;
}

type GenerateOptions<P extends object> = {
  sheet: StyleSheet<P>;
  props?: P;
  fns?: Array<Function>;
};

function generate<P extends object>(options: GenerateOptions<P>): [string, string] {
  const { sheet: $sheet, props, fns } = options;
  const [sheet, keyframes] = split($sheet);
  const key = sheet.generate({ className: FUNCTION_MARK, props, fns });
  const item = cache.get(key);
  const className = item ? item[0] : genClassName(key);
  const css = item ? item[1] : key.replaceAll(FUNCTION_MARK, className);
  let $css = '';

  $css += css;
  cache.set(key, [className, css]);

  for (const token of keyframes) {
    const css = token.generate();

    $css += css;
    cache.set(css, [token.value, css]);
  }

  return [className, $css];
}

function split<P extends object>(source: StyleSheet<P>): [StyleSheet<P>, Array<KeyframesRule<P>>] {
  const sheet = new StyleSheet<P>();
  const keyframes: Array<KeyframesRule<P>> = [];

  for (const token of source.children) {
    if (detectIsKeyframesRule(token)) {
      keyframes.push(token);
    } else {
      sheet.children.push(token);
    }
  }

  return [sheet, keyframes];
}

function slice<P extends object>(source: StyleSheet<P>): [StyleSheet<P>, Array<StyleSheet<P>>] {
  const sheet = new StyleSheet<P>();
  const sheets: Array<StyleSheet> = [];

  for (const token of source.children) {
    if (token.isDynamic) {
      const style = new StyleSheet<P>();

      style.children.push(token);
      sheets.push(style);
    } else {
      sheet.children.push(token);
    }
  }

  return [sheet, sheets];
}

function join<P>(strings: TemplateStringsArray, args: Args<P>) {
  let joined = '';
  let keyframes = '';

  for (let i = 0; i < strings.length; i++) {
    const arg = args[i];

    joined += strings[i];

    if (detectIsStyled(arg)) {
      joined += `${DOT_MARK}${arg[$$styled].className}`;
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

  setAttr(tag, STYLED_COMPONENTS_ATTR, String(true));
  append(document.head, tag);

  return tag;
}

function inject(css: string, tag: HTMLStyleElement, check = false) {
  if (check && tag.textContent.indexOf(css) !== -1) return;
  tag.textContent = `${tag.textContent}${css}`;
}

const joinStyles = (x: Array<string>) => x.join('');

const getTag = () => getElement(`[${STYLED_COMPONENTS_ATTR}="true"]`) as HTMLStyleElement;

const css = <P extends object>(strings: TemplateStringsArray, ...args: Args<P>) => parse<P>(join(strings, args));

const getClassNamesFrom = (props: StyledProps) => (props.class || props.className || '').split(BLANK_SPACE);

const genClassName = (key: string) => `${CLASS_NAME_PREFIX}-${hash(key)}`;

const detectIsStyled = (x: unknown): x is StyledComponentFactory => detectIsFunction(x) && Boolean(x[$$styled]);

const filterArgs = <P>(args: Args<unknown>) =>
  args.filter(x => detectIsFunction(x) && !detectIsStyled(x)) as DynamicArgs<P>;

type Factory<P extends object> = ComponentFactory<P> | ((props: P) => TagVirtualNodeFactory);

type ClassNameFn = (className: string) => string;

type StyledElement = Component | VirtualNode | string | Array<Component | VirtualNode | string>;

type StyledProps = {
  as?: string | ComponentFactory;
  class?: string;
  className?: string;
  slot?: ((fn: ClassNameFn) => StyledElement) | StyledElement;
};

type ExtendingConfig<P extends object = {}> = {
  source: TemplateStringsArray;
  args: Args<P>;
  factory: Factory<P>;
};

type StyledComponentFactory<P extends object = {}> = {
  [$$styled]: {
    className: string;
  } & ExtendingConfig<P>;
} & ComponentFactory<P & StandardComponentProps & StyledProps>;

type TransformProps<P> = (p: P) => any;

type Fn<P extends object> = {
  (style: TemplateStringsArray, ...args: Args<P & ThemeProps>): StyledComponentFactory<P>;
  attrs: (t: TransformProps<P>) => Fn<P>;
};

type DynamicArgs<P> = Array<ArgFn<P>>;

type ArgFn<P> = Function | ((p: P) => TextBased | false);

export type Args<P> = Array<TextBased | ArgFn<P> | Keyframes>;

export { setupGlobal, styled, css, inject, filterArgs, detectIsStyled };
