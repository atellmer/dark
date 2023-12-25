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

import {
  detectIsBrowser,
  mapProps,
  mergeClassNames,
  getElement,
  getElements,
  createStyleElement,
  setAttr,
  append,
  mergeTemplates,
} from '../utils';
import {
  CLASS_NAME_PREFIX,
  FUNCTION_MARK,
  DOT_MARK,
  STYLED_ATTR,
  COMPONENTS_ATTR_VALUE,
  INTERLEAVE_COMPONENTS_ATTR_VALUE,
  BLANK_SPACE,
} from '../constants';
import { type KeyframesRule, StyleSheet, detectIsStyleSheet, detectIsKeyframesRule } from '../tokens';
import { type Keyframes, detectIsKeyframes } from '../keyframes';
import { type ThemeProps, useTheme } from '../theme';
import { type TextBased } from '../shared';
import { useManager } from '../server/manager';
import { parse } from '../parse';
import { hash } from '../hash';

let cache: Map<string, [string, string]> = null;
let injections: Set<string> = null;
let tag: HTMLStyleElement = null;
let isLoaded = false;
const $$styled = Symbol('styled');

setupGlobal();
function styled<P extends object, T extends object = {}>(tagName: string | ComponentFactory<P>) {
  const factory = detectIsString(tagName) ? (props: P) => View({ as: tagName, ...props }) : tagName;

  if (!isLoaded && detectIsBrowser()) {
    reuse(getInterleavedElements(), createTag);
    isLoaded = true;
  }

  return createStyledComponent<P & T>(factory as Factory<P & T>);
}

function createStyledComponent<P extends StyledProps>(factory: Factory<P>) {
  let transform: TransformFn<P> = x => x;
  const isExtending = detectIsStyled(factory);
  const config = isExtending ? getExtendingConfig(factory as StyledComponentFactory<P>) : null;
  const fn = <T extends P>(source: TemplateStringsArray, ...args: Args<T & ThemeProps>) => {
    const $source = isExtending ? mergeTemplates(config.source, source) : source;
    const $args = isExtending ? [...config.args, ...args] : args;
    const $transform = isExtending ? (p: T) => transform(config.transform(p)) : transform;
    const fns = filterArgs<T>($args);
    const [sheet, sheets] = slice<T>(css($source, ...$args));
    const [baseName, baseStyle, baseKeyframes] = generate({ sheet, cache });
    const styled = forwardRef<T, unknown>(
      component((props, ref) => {
        const { as: component, ...rest } = props;
        const theme = useTheme();
        const isSwap = detectIsFunction(component);
        const $props = (isSwap ? rest : props) as unknown as T;
        const $factory = isSwap ? component : isExtending ? config.factory : factory;
        const [className, styles, keyframes] = useMemo(() => {
          const [names, styles, keyframes] = sheets.reduce(
            (acc, sheet) => {
              const [className, style, keyframes] = generate({ sheet, cache, props: { ...props, theme }, fns });
              const [names, styles, keyframesList] = acc;

              names.push(className);
              styles.push(style);
              keyframesList.push(keyframes);

              return acc;
            },
            [[], [baseStyle], [baseKeyframes]] as [Array<string>, Array<string>, Array<string>],
          );
          const className = mergeClassNames([...getClassNamesFrom(props), baseName, ...names]);

          return [className, filter(styles, injections), filter(keyframes, injections)] as [
            string,
            Array<string>,
            Array<string>,
          ];
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

          styles.forEach(css => inject(css, tag));
          keyframes.forEach(css => inject(css, tag));
        }, [...styles, ...keyframes]);

        if (detectIsServer()) {
          const manager = useManager(); // special case of hook using, should be last in order

          styles.forEach(css => manager.collectComponentStyle(css));
          keyframes.forEach(css => manager.collectComponentStyle(css));
          manager.reset(setupGlobal);
        }

        if (detectIsFunction($props.slot)) {
          $props.slot = $props.slot((x: string) => `${baseName}_${x}`);
        }

        return $factory({ ...$transform($props), ref, className });
      }),
    ) as StyledComponentFactory<T>;

    styled[$$styled] = {
      className: baseName,
      source: $source,
      args: $args,
      factory: (config?.factory || factory) as Factory<T>,
      transform: config ? p => transform(config.transform(p)) : transform,
    };

    return styled;
  };

  fn.attrs = (t: TransformFn<P>) => {
    transform = detectIsFunction(t) ? t : transform;

    return fn;
  };

  return fn;
}

function filter(styles: Array<string>, injections: Set<string>) {
  const $styles: Array<string> = [];

  for (const css of styles) {
    if (!injections.has(css)) {
      $styles.push(css);
      injections.add(css);
    }
  }

  return $styles;
}

function setupGlobal() {
  cache = new Map();
  injections = new Set();
  tag = null;
  isLoaded = false;
}

function getExtendingConfig<P extends object>(factory: StyledComponentFactory<P>) {
  const { className, ...rest } = factory[$$styled];
  const config: ExtendingConfig<P> = rest;

  return config;
}

type GenerateOptions<P extends object> = {
  sheet: StyleSheet<P>;
  cache: Map<string, [string, string]>;
  props?: P;
  fns?: Array<Function>;
};

function generate<P extends object>(options: GenerateOptions<P>): [string, string, string] {
  const { sheet: $sheet, cache, props, fns } = options;
  const [sheet, rules] = split($sheet);
  const key = sheet.generate({ className: FUNCTION_MARK, props, fns });
  const item = cache.get(key);
  const className = item ? item[0] : genClassName(key);
  const css = item ? item[1] : key.replaceAll(FUNCTION_MARK, className);
  let style = '';
  let keyframes = '';

  style += css;
  cache.set(key, [className, css]);

  for (const rule of rules) {
    keyframes += rule.generate();
  }

  return [className, style, keyframes];
}

function split<P extends object>(source: StyleSheet<P>): [StyleSheet<P>, Array<KeyframesRule<P>>] {
  const sheet = new StyleSheet<P>();
  const rules: Array<KeyframesRule<P>> = [];

  for (const token of source.children) {
    if (detectIsKeyframesRule(token)) {
      rules.push(token);
    } else {
      sheet.children.push(token);
    }
  }

  return [sheet, rules];
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
    } else if (detectIsStyleSheet(arg)) {
      joined += arg.generate();
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

  setAttr(tag, STYLED_ATTR, COMPONENTS_ATTR_VALUE);
  append(document.head, tag);

  return tag;
}

function inject(css: string, tag: HTMLStyleElement) {
  tag.textContent = `${tag.textContent}${css}`;
}

function reuse(elements: Array<HTMLStyleElement>, createTag: () => HTMLStyleElement) {
  if (elements.length === 0) return;
  const tag = createTag();
  let content = '';

  for (const element of elements) {
    content += element.textContent;
    element.remove();
  }

  tag.textContent = content;
}

function getInterleavedElements() {
  return getElements(`[${STYLED_ATTR}="${INTERLEAVE_COMPONENTS_ATTR_VALUE}"]`) as Array<HTMLStyleElement>;
}

const getTag = () => getElement(`[${STYLED_ATTR}="${COMPONENTS_ATTR_VALUE}"]`) as HTMLStyleElement;

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
  style?: string | Record<string, string>;
  slot?: ((fn: ClassNameFn) => StyledElement) | StyledElement;
};

type ExtendingConfig<P extends object = {}> = {
  source: TemplateStringsArray;
  args: Args<P>;
  factory: Factory<P>;
  transform: (x: P) => P;
};

type StyledComponentFactory<P extends object = {}> = {
  [$$styled]: {
    className: string;
  } & ExtendingConfig<P>;
} & ComponentFactory<P & StandardComponentProps & StyledProps>;

type TransformFn<P> = (p: P) => any;

type DynamicArgs<P> = Array<ArgFn<P>>;

type ArgFn<P> = Function | ((p: P) => TextBased | false);

export type Args<P> = Array<TextBased | ArgFn<P> | StyleSheet | Keyframes>;

styled.a = styled('a');
styled.abbr = styled('abbr');
styled.address = styled('address');
styled.area = styled('area');
styled.article = styled('article');
styled.aside = styled('aside');
styled.audio = styled('audio');
styled.b = styled('b');
styled.base = styled('base');
styled.bdi = styled('bdi');
styled.bdo = styled('bdo');
styled.blockquote = styled('blockquote');
styled.body = styled('body');
styled.br = styled('br');
styled.button = styled('button');
styled.canvas = styled('canvas');
styled.caption = styled('caption');
styled.cite = styled('cite');
styled.code = styled('code');
styled.col = styled('col');
styled.colgroup = styled('colgroup');
styled.data = styled('data');
styled.datalist = styled('datalist');
styled.dd = styled('dd');
styled.del = styled('del');
styled.details = styled('details');
styled.dfn = styled('dfn');
styled.dialog = styled('dialog');
styled.div = styled('div');
styled.dl = styled('dl');
styled.dt = styled('dt');
styled.em = styled('em');
styled.embed = styled('embed');
styled.fieldset = styled('fieldset');
styled.figcaption = styled('figcaption');
styled.figure = styled('figure');
styled.footer = styled('footer');
styled.form = styled('form');
styled.h1 = styled('h1');
styled.h2 = styled('h2');
styled.h3 = styled('h3');
styled.h4 = styled('h4');
styled.h5 = styled('h5');
styled.h6 = styled('h6');
styled.head = styled('head');
styled.header = styled('header');
styled.hgroup = styled('hgroup');
styled.hr = styled('hr');
styled.html = styled('html');
styled.i = styled('i');
styled.iframe = styled('iframe');
styled.img = styled('img');
styled.input = styled('input');
styled.ins = styled('ins');
styled.kbd = styled('kbd');
styled.label = styled('label');
styled.legend = styled('legend');
styled.li = styled('li');
styled.link = styled('link');
styled.main = styled('main');
styled.map = styled('map');
styled.mark = styled('mark');
styled.menu = styled('menu');
styled.meta = styled('meta');
styled.meter = styled('meter');
styled.nav = styled('nav');
styled.noscript = styled('noscript');
styled.object = styled('object');
styled.ol = styled('ol');
styled.optgroup = styled('optgroup');
styled.option = styled('option');
styled.output = styled('output');
styled.p = styled('p');
styled.param = styled('param');
styled.picture = styled('picture');
styled.pre = styled('pre');
styled.progress = styled('progress');
styled.q = styled('q');
styled.rp = styled('rp');
styled.rt = styled('rt');
styled.ruby = styled('ruby');
styled.s = styled('s');
styled.samp = styled('samp');
styled.script = styled('script');
styled.section = styled('section');
styled.select = styled('select');
styled.small = styled('small');
styled.source = styled('source');
styled.span = styled('span');
styled.strong = styled('strong');
styled.style = styled('style');
styled.sub = styled('sub');
styled.summary = styled('summary');
styled.sup = styled('sup');
styled.table = styled('table');
styled.tbody = styled('tbody');
styled.td = styled('td');
styled.template = styled('template');
styled.textarea = styled('textarea');
styled.tfoot = styled('tfoot');
styled.th = styled('th');
styled.thead = styled('thead');
styled.time = styled('time');
styled.title = styled('title');
styled.tr = styled('tr');
styled.track = styled('track');
styled.u = styled('u');
styled.ul = styled('ul');
styled.var = styled('var');
styled.video = styled('video');
styled.wbr = styled('wbr');
styled.svg = styled('svg');
styled.circle = styled('circle');
styled.clipPath = styled('clipPath');
styled.defs = styled('defs');
styled.desc = styled('desc');
styled.ellipse = styled('ellipse');
styled.feBlend = styled('feBlend');
styled.feColorMatrix = styled('feColorMatrix');
styled.feComponentTransfer = styled('feComponentTransfer');
styled.feComposite = styled('feComposite');
styled.feConvolveMatrix = styled('feConvolveMatrix');
styled.feDiffuseLighting = styled('feDiffuseLighting');
styled.feDisplacementMap = styled('feDisplacementMap');
styled.feDistantLight = styled('feDistantLight');
styled.feFlood = styled('feFlood');
styled.feFuncA = styled('feFuncA');
styled.feFuncB = styled('feFuncB');
styled.feFuncG = styled('feFuncG');
styled.feFuncR = styled('feFuncR');
styled.feGaussianBlur = styled('feGaussianBlur');
styled.feImage = styled('feImage');
styled.feMerge = styled('feMerge');
styled.feMergeNode = styled('feMergeNode');
styled.feMorphology = styled('feMorphology');
styled.feOffset = styled('feOffset');
styled.fePointLight = styled('fePointLight');
styled.feSpecularLighting = styled('feSpecularLighting');
styled.feSpotLight = styled('feSpotLight');
styled.feTile = styled('feTile');
styled.feTurbulence = styled('feTurbulence');
styled.filter = styled('filter');
styled.g = styled('g');
styled.image = styled('image');
styled.line = styled('line');
styled.linearGradient = styled('linearGradient');
styled.marker = styled('marker');
styled.mask = styled('mask');
styled.path = styled('path');
styled.pattern = styled('pattern');
styled.polygon = styled('polygon');
styled.polyline = styled('polyline');
styled.radialGradient = styled('radialGradient');
styled.rect = styled('rect');
styled.stop = styled('stop');
styled.switch = styled('switch');
styled.symbol = styled('symbol');
styled.text = styled('text');
styled.textPath = styled('textPath');
styled.tspan = styled('tspan');
styled.use = styled('use');
styled.view = styled('view');

export { setupGlobal, styled, css, inject, reuse, getTag, filterArgs, detectIsStyled };
