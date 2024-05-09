import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type StandardComponentProps,
  type TextBased,
  type DarkElement,
  View,
  component,
  useMemo,
  detectIsString,
  detectIsFunction,
  detectIsTextBased,
  detectIsServer,
  useInsertionEffect,
  mapRecord,
} from '@dark-engine/core';
import { type DarkJSX } from '@dark-engine/platform-browser';

import {
  CLASS_NAME_PREFIX,
  FUNCTION_MARK,
  DOT_MARK,
  STYLED_ATTR,
  COMPONENTS_ATTR_VALUE,
  INTERLEAVE_COMPONENTS_ATTR_VALUE,
  BLANK_SPACE,
} from '../constants';
import {
  detectIsBrowser,
  mergeClassNames,
  getElement,
  getElements,
  createStyleElement,
  setAttr,
  append,
  mergeTemplates,
} from '../utils';
import { type KeyframesRule, StyleSheet, detectIsStyleSheet, detectIsKeyframesRule } from '../tokens';
import { type Keyframes, detectIsKeyframes } from '../keyframes';
import { type ThemeProps, useTheme } from '../theme';
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
  const isString = detectIsString(tagName);
  const factory = isString ? (props: P) => View({ as: tagName, ...props }) : tagName;
  const targetName = isString ? tagName : (factory as ComponentFactory<P>).displayName || 'Component';
  const displayName = `Styled.${targetName}`;

  if (!isLoaded && detectIsBrowser()) {
    reuse(getInterleavedElements(), createTag);
    isLoaded = true;
  }

  return createStyledComponent<P & T>(factory as Factory<P & T>, displayName);
}

function createStyledComponent<P extends StyledProps>(factory: Factory<P>, displayName: string) {
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
    const styled = component<T>(
      props => {
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
        }, [...mapRecord(props), theme]);

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
          $props.slot = $props.slot((x: string) => `${className}_${x}`);
        }

        return $factory({ ...$transform($props), className });
      },
      { displayName },
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

  for (const style of styles) {
    if (style && !injections.has(style)) {
      $styles.push(style);
      injections.add(style);
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

function reuse(elements: Array<HTMLStyleElement>, createTag: () => HTMLStyleElement, isComponentStyle = true) {
  if (elements.length === 0) return;
  const tag = createTag();
  let content = '';

  for (const element of elements) {
    const style = element.textContent;

    isComponentStyle && filter([style], injections);
    content += style;
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

type StyledProps = {
  as?: string | ComponentFactory;
  class?: string;
  className?: string;
  style?: string | Record<string, string>;
  slot?: ((fn: ClassNameFn) => DarkElement) | DarkElement;
};

type ExtendingConfig<P extends object = {}> = {
  source: TemplateStringsArray;
  args: Args<P>;
  factory: Factory<P>;
  transform: (x: P) => P;
};

type TransformFn<P> = (p: P) => any;

type DynamicArgs<P> = Array<ArgFn<P>>;

type ArgFn<P> = Function | ((p: P) => TextBased | false);

export type Args<P> = Array<TextBased | ArgFn<P> | StyleSheet | Keyframes>;

export type StyledComponentFactory<P extends object = {}> = {
  [$$styled]: {
    className: string;
  } & ExtendingConfig<P>;
} & ComponentFactory<P & StandardComponentProps & StyledProps>;

type FactoryFn<P extends object> = {
  <T extends P>(source: TemplateStringsArray, ...args: Args<T & ThemeProps>): StyledComponentFactory<T>;
  attrs: (t: TransformFn<P>) => FactoryFn<P>;
};

styled.a = styled('a') as FactoryFn<DarkJSX.Elements['a']>;
styled.abbr = styled('abbr') as FactoryFn<DarkJSX.Elements['abbr']>;
styled.address = styled('address') as FactoryFn<DarkJSX.Elements['address']>;
styled.area = styled('area') as FactoryFn<DarkJSX.Elements['area']>;
styled.article = styled('article') as FactoryFn<DarkJSX.Elements['article']>;
styled.aside = styled('aside') as FactoryFn<DarkJSX.Elements['aside']>;
styled.audio = styled('audio') as FactoryFn<DarkJSX.Elements['audio']>;
styled.b = styled('b') as FactoryFn<DarkJSX.Elements['b']>;
styled.base = styled('base') as FactoryFn<DarkJSX.Elements['base']>;
styled.bdi = styled('bdi') as FactoryFn<DarkJSX.Elements['bdi']>;
styled.bdo = styled('bdo') as FactoryFn<DarkJSX.Elements['bdo']>;
styled.blockquote = styled('blockquote') as FactoryFn<DarkJSX.Elements['blockquote']>;
styled.body = styled('body') as FactoryFn<DarkJSX.Elements['body']>;
styled.br = styled('br') as FactoryFn<DarkJSX.Elements['br']>;
styled.button = styled('button') as FactoryFn<DarkJSX.Elements['button']>;
styled.canvas = styled('canvas') as FactoryFn<DarkJSX.Elements['canvas']>;
styled.caption = styled('caption') as FactoryFn<DarkJSX.Elements['caption']>;
styled.cite = styled('cite') as FactoryFn<DarkJSX.Elements['cite']>;
styled.code = styled('code') as FactoryFn<DarkJSX.Elements['code']>;
styled.col = styled('col') as FactoryFn<DarkJSX.Elements['col']>;
styled.colgroup = styled('colgroup') as FactoryFn<DarkJSX.Elements['colgroup']>;
styled.data = styled('data') as FactoryFn<DarkJSX.Elements['data']>;
styled.datalist = styled('datalist') as FactoryFn<DarkJSX.Elements['datalist']>;
styled.dd = styled('dd') as FactoryFn<DarkJSX.Elements['dd']>;
styled.del = styled('del') as FactoryFn<DarkJSX.Elements['del']>;
styled.details = styled('details') as FactoryFn<DarkJSX.Elements['details']>;
styled.dfn = styled('dfn') as FactoryFn<DarkJSX.Elements['dfn']>;
styled.dialog = styled('dialog') as FactoryFn<DarkJSX.Elements['dialog']>;
styled.div = styled('div') as FactoryFn<DarkJSX.Elements['div']>;
styled.dl = styled('dl') as FactoryFn<DarkJSX.Elements['dl']>;
styled.dt = styled('dt') as FactoryFn<DarkJSX.Elements['dt']>;
styled.em = styled('em') as FactoryFn<DarkJSX.Elements['em']>;
styled.embed = styled('embed') as FactoryFn<DarkJSX.Elements['embed']>;
styled.fieldset = styled('fieldset') as FactoryFn<DarkJSX.Elements['fieldset']>;
styled.figcaption = styled('figcaption') as FactoryFn<DarkJSX.Elements['figcaption']>;
styled.figure = styled('figure') as FactoryFn<DarkJSX.Elements['figure']>;
styled.footer = styled('footer') as FactoryFn<DarkJSX.Elements['footer']>;
styled.form = styled('form') as FactoryFn<DarkJSX.Elements['form']>;
styled.h1 = styled('h1') as FactoryFn<DarkJSX.Elements['h1']>;
styled.h2 = styled('h2') as FactoryFn<DarkJSX.Elements['h2']>;
styled.h3 = styled('h3') as FactoryFn<DarkJSX.Elements['h3']>;
styled.h4 = styled('h4') as FactoryFn<DarkJSX.Elements['h4']>;
styled.h5 = styled('h5') as FactoryFn<DarkJSX.Elements['h5']>;
styled.h6 = styled('h6') as FactoryFn<DarkJSX.Elements['h6']>;
styled.head = styled('head') as FactoryFn<DarkJSX.Elements['head']>;
styled.header = styled('header') as FactoryFn<DarkJSX.Elements['header']>;
styled.hgroup = styled('hgroup') as FactoryFn<DarkJSX.Elements['hgroup']>;
styled.hr = styled('hr') as FactoryFn<DarkJSX.Elements['hr']>;
styled.html = styled('html') as FactoryFn<DarkJSX.Elements['html']>;
styled.i = styled('i') as FactoryFn<DarkJSX.Elements['i']>;
styled.iframe = styled('iframe') as FactoryFn<DarkJSX.Elements['iframe']>;
styled.img = styled('img') as FactoryFn<DarkJSX.Elements['img']>;
styled.input = styled('input') as FactoryFn<DarkJSX.Elements['input']>;
styled.ins = styled('ins') as FactoryFn<DarkJSX.Elements['ins']>;
styled.kbd = styled('kbd') as FactoryFn<DarkJSX.Elements['kbd']>;
styled.label = styled('label') as FactoryFn<DarkJSX.Elements['label']>;
styled.legend = styled('legend') as FactoryFn<DarkJSX.Elements['legend']>;
styled.li = styled('li') as FactoryFn<DarkJSX.Elements['li']>;
styled.link = styled('link') as FactoryFn<DarkJSX.Elements['link']>;
styled.main = styled('main') as FactoryFn<DarkJSX.Elements['main']>;
styled.map = styled('map') as FactoryFn<DarkJSX.Elements['map']>;
styled.mark = styled('mark') as FactoryFn<DarkJSX.Elements['mark']>;
styled.menu = styled('menu') as FactoryFn<DarkJSX.Elements['menu']>;
styled.meta = styled('meta') as FactoryFn<DarkJSX.Elements['meta']>;
styled.meter = styled('meter') as FactoryFn<DarkJSX.Elements['meter']>;
styled.nav = styled('nav') as FactoryFn<DarkJSX.Elements['nav']>;
styled.noscript = styled('noscript') as FactoryFn<DarkJSX.Elements['noscript']>;
styled.object = styled('object') as FactoryFn<DarkJSX.Elements['object']>;
styled.ol = styled('ol') as FactoryFn<DarkJSX.Elements['ol']>;
styled.optgroup = styled('optgroup') as FactoryFn<DarkJSX.Elements['optgroup']>;
styled.option = styled('option') as FactoryFn<DarkJSX.Elements['option']>;
styled.output = styled('output') as FactoryFn<DarkJSX.Elements['output']>;
styled.p = styled('p') as FactoryFn<DarkJSX.Elements['p']>;
styled.param = styled('param') as FactoryFn<DarkJSX.Elements['param']>;
styled.picture = styled('picture') as FactoryFn<DarkJSX.Elements['picture']>;
styled.pre = styled('pre') as FactoryFn<DarkJSX.Elements['pre']>;
styled.progress = styled('progress') as FactoryFn<DarkJSX.Elements['progress']>;
styled.q = styled('q') as FactoryFn<DarkJSX.Elements['q']>;
styled.rp = styled('rp') as FactoryFn<DarkJSX.Elements['rp']>;
styled.rt = styled('rt') as FactoryFn<DarkJSX.Elements['rt']>;
styled.ruby = styled('ruby') as FactoryFn<DarkJSX.Elements['ruby']>;
styled.s = styled('s') as FactoryFn<DarkJSX.Elements['s']>;
styled.samp = styled('samp') as FactoryFn<DarkJSX.Elements['samp']>;
styled.script = styled('script') as FactoryFn<DarkJSX.Elements['script']>;
styled.section = styled('section') as FactoryFn<DarkJSX.Elements['section']>;
styled.select = styled('select') as FactoryFn<DarkJSX.Elements['select']>;
styled.small = styled('small') as FactoryFn<DarkJSX.Elements['small']>;
styled.source = styled('source') as FactoryFn<DarkJSX.Elements['source']>;
styled.span = styled('span') as FactoryFn<DarkJSX.Elements['span']>;
styled.strong = styled('strong') as FactoryFn<DarkJSX.Elements['strong']>;
styled.style = styled('style') as FactoryFn<DarkJSX.Elements['style']>;
styled.sub = styled('sub') as FactoryFn<DarkJSX.Elements['sub']>;
styled.summary = styled('summary') as FactoryFn<DarkJSX.Elements['summary']>;
styled.sup = styled('sup') as FactoryFn<DarkJSX.Elements['sup']>;
styled.table = styled('table') as FactoryFn<DarkJSX.Elements['table']>;
styled.tbody = styled('tbody') as FactoryFn<DarkJSX.Elements['tbody']>;
styled.td = styled('td') as FactoryFn<DarkJSX.Elements['td']>;
styled.template = styled('template') as FactoryFn<DarkJSX.Elements['template']>;
styled.textarea = styled('textarea') as FactoryFn<DarkJSX.Elements['textarea']>;
styled.tfoot = styled('tfoot') as FactoryFn<DarkJSX.Elements['tfoot']>;
styled.th = styled('th') as FactoryFn<DarkJSX.Elements['th']>;
styled.thead = styled('thead') as FactoryFn<DarkJSX.Elements['thead']>;
styled.time = styled('time') as FactoryFn<DarkJSX.Elements['time']>;
styled.title = styled('title') as FactoryFn<DarkJSX.Elements['title']>;
styled.tr = styled('tr') as FactoryFn<DarkJSX.Elements['tr']>;
styled.track = styled('track') as FactoryFn<DarkJSX.Elements['track']>;
styled.u = styled('u') as FactoryFn<DarkJSX.Elements['u']>;
styled.ul = styled('ul') as FactoryFn<DarkJSX.Elements['ul']>;
styled.var = styled('var') as FactoryFn<DarkJSX.Elements['var']>;
styled.video = styled('video') as FactoryFn<DarkJSX.Elements['video']>;
styled.wbr = styled('wbr') as FactoryFn<DarkJSX.Elements['wbr']>;
styled.circle = styled('circle') as FactoryFn<DarkJSX.Elements['circle']>;
styled.clipPath = styled('clipPath') as FactoryFn<DarkJSX.Elements['clipPath']>;
styled.defs = styled('defs') as FactoryFn<DarkJSX.Elements['defs']>;
styled.desc = styled('desc') as FactoryFn<DarkJSX.Elements['desc']>;
styled.ellipse = styled('ellipse') as FactoryFn<DarkJSX.Elements['ellipse']>;
styled.feBlend = styled('feBlend') as FactoryFn<DarkJSX.Elements['feBlend']>;
styled.feColorMatrix = styled('feColorMatrix') as FactoryFn<DarkJSX.Elements['feColorMatrix']>;
styled.feComponentTransfer = styled('feComponentTransfer') as FactoryFn<DarkJSX.Elements['feComponentTransfer']>;
styled.feComposite = styled('feComposite') as FactoryFn<DarkJSX.Elements['feComposite']>;
styled.feConvolveMatrix = styled('feConvolveMatrix') as FactoryFn<DarkJSX.Elements['feConvolveMatrix']>;
styled.feDiffuseLighting = styled('feDiffuseLighting') as FactoryFn<DarkJSX.Elements['feDiffuseLighting']>;
styled.feDisplacementMap = styled('feDisplacementMap') as FactoryFn<DarkJSX.Elements['feDisplacementMap']>;
styled.feDistantLight = styled('feDistantLight') as FactoryFn<DarkJSX.Elements['feDistantLight']>;
styled.feFlood = styled('feFlood') as FactoryFn<DarkJSX.Elements['feFlood']>;
styled.feFuncA = styled('feFuncA') as FactoryFn<DarkJSX.Elements['feFuncA']>;
styled.feFuncB = styled('feFuncB') as FactoryFn<DarkJSX.Elements['feFuncB']>;
styled.feFuncG = styled('feFuncG') as FactoryFn<DarkJSX.Elements['feFuncG']>;
styled.feFuncR = styled('feFuncR') as FactoryFn<DarkJSX.Elements['feFuncR']>;
styled.feGaussianBlur = styled('feGaussianBlur') as FactoryFn<DarkJSX.Elements['feGaussianBlur']>;
styled.feImage = styled('feImage') as FactoryFn<DarkJSX.Elements['feImage']>;
styled.feMerge = styled('feMerge') as FactoryFn<DarkJSX.Elements['feMerge']>;
styled.feMergeNode = styled('feMergeNode') as FactoryFn<DarkJSX.Elements['feMergeNode']>;
styled.feMorphology = styled('feMorphology') as FactoryFn<DarkJSX.Elements['feMorphology']>;
styled.feOffset = styled('feOffset') as FactoryFn<DarkJSX.Elements['feOffset']>;
styled.fePointLight = styled('fePointLight') as FactoryFn<DarkJSX.Elements['fePointLight']>;
styled.feSpecularLighting = styled('feSpecularLighting') as FactoryFn<DarkJSX.Elements['feSpecularLighting']>;
styled.feSpotLight = styled('feSpotLight') as FactoryFn<DarkJSX.Elements['feSpotLight']>;
styled.feTile = styled('feTile') as FactoryFn<DarkJSX.Elements['feTile']>;
styled.feTurbulence = styled('feTurbulence') as FactoryFn<DarkJSX.Elements['feTurbulence']>;
styled.filter = styled('filter') as FactoryFn<DarkJSX.Elements['filter']>;
styled.g = styled('g') as FactoryFn<DarkJSX.Elements['g']>;
styled.image = styled('image') as FactoryFn<DarkJSX.Elements['image']>;
styled.line = styled('line') as FactoryFn<DarkJSX.Elements['line']>;
styled.linearGradient = styled('linearGradient') as FactoryFn<DarkJSX.Elements['linearGradient']>;
styled.marker = styled('marker') as FactoryFn<DarkJSX.Elements['marker']>;
styled.mask = styled('mask') as FactoryFn<DarkJSX.Elements['mask']>;
styled.path = styled('path') as FactoryFn<DarkJSX.Elements['path']>;
styled.pattern = styled('pattern') as FactoryFn<DarkJSX.Elements['pattern']>;
styled.polygon = styled('polygon') as FactoryFn<DarkJSX.Elements['polygon']>;
styled.polyline = styled('polyline') as FactoryFn<DarkJSX.Elements['polyline']>;
styled.radialGradient = styled('radialGradient') as FactoryFn<DarkJSX.Elements['radialGradient']>;
styled.rect = styled('rect') as FactoryFn<DarkJSX.Elements['rect']>;
styled.stop = styled('stop') as FactoryFn<DarkJSX.Elements['stop']>;
styled.svg = styled('svg') as FactoryFn<DarkJSX.Elements['svg']>;
styled.switch = styled('switch') as FactoryFn<DarkJSX.Elements['switch']>;
styled.symbol = styled('symbol') as FactoryFn<DarkJSX.Elements['symbol']>;
styled.text = styled('text') as FactoryFn<DarkJSX.Elements['text']>;
styled.textPath = styled('textPath') as FactoryFn<DarkJSX.Elements['textPath']>;
styled.tspan = styled('tspan') as FactoryFn<DarkJSX.Elements['tspan']>;
styled.use = styled('use') as FactoryFn<DarkJSX.Elements['use']>;
styled.view = styled('view') as FactoryFn<DarkJSX.Elements['view']>;

export { setupGlobal, styled, css, inject, reuse, getTag, filterArgs, detectIsStyled };
