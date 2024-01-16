import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  type StandardComponentProps,
  type TextBased,
  type DarkElement,
  View,
  component,
  forwardRef,
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

styled.a = styled('a') as FactoryFn<DarkJSX.HTMLTags['a']>;
styled.abbr = styled('abbr') as FactoryFn<DarkJSX.HTMLTags['abbr']>;
styled.address = styled('address') as FactoryFn<DarkJSX.HTMLTags['address']>;
styled.area = styled('area') as FactoryFn<DarkJSX.HTMLTags['area']>;
styled.article = styled('article') as FactoryFn<DarkJSX.HTMLTags['article']>;
styled.aside = styled('aside') as FactoryFn<DarkJSX.HTMLTags['aside']>;
styled.audio = styled('audio') as FactoryFn<DarkJSX.HTMLTags['audio']>;
styled.b = styled('b') as FactoryFn<DarkJSX.HTMLTags['b']>;
styled.base = styled('base') as FactoryFn<DarkJSX.HTMLTags['base']>;
styled.bdi = styled('bdi') as FactoryFn<DarkJSX.HTMLTags['bdi']>;
styled.bdo = styled('bdo') as FactoryFn<DarkJSX.HTMLTags['bdo']>;
styled.blockquote = styled('blockquote') as FactoryFn<DarkJSX.HTMLTags['blockquote']>;
styled.body = styled('body') as FactoryFn<DarkJSX.HTMLTags['body']>;
styled.br = styled('br') as FactoryFn<DarkJSX.HTMLTags['br']>;
styled.button = styled('button') as FactoryFn<DarkJSX.HTMLTags['button']>;
styled.canvas = styled('canvas') as FactoryFn<DarkJSX.HTMLTags['canvas']>;
styled.caption = styled('caption') as FactoryFn<DarkJSX.HTMLTags['caption']>;
styled.cite = styled('cite') as FactoryFn<DarkJSX.HTMLTags['cite']>;
styled.code = styled('code') as FactoryFn<DarkJSX.HTMLTags['code']>;
styled.col = styled('col') as FactoryFn<DarkJSX.HTMLTags['col']>;
styled.colgroup = styled('colgroup') as FactoryFn<DarkJSX.HTMLTags['colgroup']>;
styled.data = styled('data') as FactoryFn<DarkJSX.HTMLTags['data']>;
styled.datalist = styled('datalist') as FactoryFn<DarkJSX.HTMLTags['datalist']>;
styled.dd = styled('dd') as FactoryFn<DarkJSX.HTMLTags['dd']>;
styled.del = styled('del') as FactoryFn<DarkJSX.HTMLTags['del']>;
styled.details = styled('details') as FactoryFn<DarkJSX.HTMLTags['details']>;
styled.dfn = styled('dfn') as FactoryFn<DarkJSX.HTMLTags['dfn']>;
styled.dialog = styled('dialog') as FactoryFn<DarkJSX.HTMLTags['dialog']>;
styled.div = styled('div') as FactoryFn<DarkJSX.HTMLTags['div']>;
styled.dl = styled('dl') as FactoryFn<DarkJSX.HTMLTags['dl']>;
styled.dt = styled('dt') as FactoryFn<DarkJSX.HTMLTags['dt']>;
styled.em = styled('em') as FactoryFn<DarkJSX.HTMLTags['em']>;
styled.embed = styled('embed') as FactoryFn<DarkJSX.HTMLTags['embed']>;
styled.fieldset = styled('fieldset') as FactoryFn<DarkJSX.HTMLTags['fieldset']>;
styled.figcaption = styled('figcaption') as FactoryFn<DarkJSX.HTMLTags['figcaption']>;
styled.figure = styled('figure') as FactoryFn<DarkJSX.HTMLTags['figure']>;
styled.footer = styled('footer') as FactoryFn<DarkJSX.HTMLTags['footer']>;
styled.form = styled('form') as FactoryFn<DarkJSX.HTMLTags['form']>;
styled.h1 = styled('h1') as FactoryFn<DarkJSX.HTMLTags['h1']>;
styled.h2 = styled('h2') as FactoryFn<DarkJSX.HTMLTags['h2']>;
styled.h3 = styled('h3') as FactoryFn<DarkJSX.HTMLTags['h3']>;
styled.h4 = styled('h4') as FactoryFn<DarkJSX.HTMLTags['h4']>;
styled.h5 = styled('h5') as FactoryFn<DarkJSX.HTMLTags['h5']>;
styled.h6 = styled('h6') as FactoryFn<DarkJSX.HTMLTags['h6']>;
styled.head = styled('head') as FactoryFn<DarkJSX.HTMLTags['head']>;
styled.header = styled('header') as FactoryFn<DarkJSX.HTMLTags['header']>;
styled.hgroup = styled('hgroup') as FactoryFn<DarkJSX.HTMLTags['hgroup']>;
styled.hr = styled('hr') as FactoryFn<DarkJSX.HTMLTags['hr']>;
styled.html = styled('html') as FactoryFn<DarkJSX.HTMLTags['html']>;
styled.i = styled('i') as FactoryFn<DarkJSX.HTMLTags['i']>;
styled.iframe = styled('iframe') as FactoryFn<DarkJSX.HTMLTags['iframe']>;
styled.img = styled('img') as FactoryFn<DarkJSX.HTMLTags['img']>;
styled.input = styled('input') as FactoryFn<DarkJSX.HTMLTags['input']>;
styled.ins = styled('ins') as FactoryFn<DarkJSX.HTMLTags['ins']>;
styled.kbd = styled('kbd') as FactoryFn<DarkJSX.HTMLTags['kbd']>;
styled.label = styled('label') as FactoryFn<DarkJSX.HTMLTags['label']>;
styled.legend = styled('legend') as FactoryFn<DarkJSX.HTMLTags['legend']>;
styled.li = styled('li') as FactoryFn<DarkJSX.HTMLTags['li']>;
styled.link = styled('link') as FactoryFn<DarkJSX.HTMLTags['link']>;
styled.main = styled('main') as FactoryFn<DarkJSX.HTMLTags['main']>;
styled.map = styled('map') as FactoryFn<DarkJSX.HTMLTags['map']>;
styled.mark = styled('mark') as FactoryFn<DarkJSX.HTMLTags['mark']>;
styled.menu = styled('menu') as FactoryFn<DarkJSX.HTMLTags['menu']>;
styled.meta = styled('meta') as FactoryFn<DarkJSX.HTMLTags['meta']>;
styled.meter = styled('meter') as FactoryFn<DarkJSX.HTMLTags['meter']>;
styled.nav = styled('nav') as FactoryFn<DarkJSX.HTMLTags['nav']>;
styled.noscript = styled('noscript') as FactoryFn<DarkJSX.HTMLTags['noscript']>;
styled.object = styled('object') as FactoryFn<DarkJSX.HTMLTags['object']>;
styled.ol = styled('ol') as FactoryFn<DarkJSX.HTMLTags['ol']>;
styled.optgroup = styled('optgroup') as FactoryFn<DarkJSX.HTMLTags['optgroup']>;
styled.option = styled('option') as FactoryFn<DarkJSX.HTMLTags['option']>;
styled.output = styled('output') as FactoryFn<DarkJSX.HTMLTags['output']>;
styled.p = styled('p') as FactoryFn<DarkJSX.HTMLTags['p']>;
styled.param = styled('param') as FactoryFn<DarkJSX.HTMLTags['param']>;
styled.picture = styled('picture') as FactoryFn<DarkJSX.HTMLTags['picture']>;
styled.pre = styled('pre') as FactoryFn<DarkJSX.HTMLTags['pre']>;
styled.progress = styled('progress') as FactoryFn<DarkJSX.HTMLTags['progress']>;
styled.q = styled('q') as FactoryFn<DarkJSX.HTMLTags['q']>;
styled.rp = styled('rp') as FactoryFn<DarkJSX.HTMLTags['rp']>;
styled.rt = styled('rt') as FactoryFn<DarkJSX.HTMLTags['rt']>;
styled.ruby = styled('ruby') as FactoryFn<DarkJSX.HTMLTags['ruby']>;
styled.s = styled('s') as FactoryFn<DarkJSX.HTMLTags['s']>;
styled.samp = styled('samp') as FactoryFn<DarkJSX.HTMLTags['samp']>;
styled.script = styled('script') as FactoryFn<DarkJSX.HTMLTags['script']>;
styled.section = styled('section') as FactoryFn<DarkJSX.HTMLTags['section']>;
styled.select = styled('select') as FactoryFn<DarkJSX.HTMLTags['select']>;
styled.small = styled('small') as FactoryFn<DarkJSX.HTMLTags['small']>;
styled.source = styled('source') as FactoryFn<DarkJSX.HTMLTags['source']>;
styled.span = styled('span') as FactoryFn<DarkJSX.HTMLTags['span']>;
styled.strong = styled('strong') as FactoryFn<DarkJSX.HTMLTags['strong']>;
styled.style = styled('style') as FactoryFn<DarkJSX.HTMLTags['style']>;
styled.sub = styled('sub') as FactoryFn<DarkJSX.HTMLTags['sub']>;
styled.summary = styled('summary') as FactoryFn<DarkJSX.HTMLTags['summary']>;
styled.sup = styled('sup') as FactoryFn<DarkJSX.HTMLTags['sup']>;
styled.table = styled('table') as FactoryFn<DarkJSX.HTMLTags['table']>;
styled.tbody = styled('tbody') as FactoryFn<DarkJSX.HTMLTags['tbody']>;
styled.td = styled('td') as FactoryFn<DarkJSX.HTMLTags['td']>;
styled.template = styled('template') as FactoryFn<DarkJSX.HTMLTags['template']>;
styled.textarea = styled('textarea') as FactoryFn<DarkJSX.HTMLTags['textarea']>;
styled.tfoot = styled('tfoot') as FactoryFn<DarkJSX.HTMLTags['tfoot']>;
styled.th = styled('th') as FactoryFn<DarkJSX.HTMLTags['th']>;
styled.thead = styled('thead') as FactoryFn<DarkJSX.HTMLTags['thead']>;
styled.time = styled('time') as FactoryFn<DarkJSX.HTMLTags['time']>;
styled.title = styled('title') as FactoryFn<DarkJSX.HTMLTags['title']>;
styled.tr = styled('tr') as FactoryFn<DarkJSX.HTMLTags['tr']>;
styled.track = styled('track') as FactoryFn<DarkJSX.HTMLTags['track']>;
styled.u = styled('u') as FactoryFn<DarkJSX.HTMLTags['u']>;
styled.ul = styled('ul') as FactoryFn<DarkJSX.HTMLTags['ul']>;
styled.var = styled('var') as FactoryFn<DarkJSX.HTMLTags['var']>;
styled.video = styled('video') as FactoryFn<DarkJSX.HTMLTags['video']>;
styled.wbr = styled('wbr') as FactoryFn<DarkJSX.HTMLTags['wbr']>;
styled.circle = styled('circle') as FactoryFn<DarkJSX.SVGTags['circle']>;
styled.clipPath = styled('clipPath') as FactoryFn<DarkJSX.SVGTags['clipPath']>;
styled.defs = styled('defs') as FactoryFn<DarkJSX.SVGTags['defs']>;
styled.desc = styled('desc') as FactoryFn<DarkJSX.SVGTags['desc']>;
styled.ellipse = styled('ellipse') as FactoryFn<DarkJSX.SVGTags['ellipse']>;
styled.feBlend = styled('feBlend') as FactoryFn<DarkJSX.SVGTags['feBlend']>;
styled.feColorMatrix = styled('feColorMatrix') as FactoryFn<DarkJSX.SVGTags['feColorMatrix']>;
styled.feComponentTransfer = styled('feComponentTransfer') as FactoryFn<DarkJSX.SVGTags['feComponentTransfer']>;
styled.feComposite = styled('feComposite') as FactoryFn<DarkJSX.SVGTags['feComposite']>;
styled.feConvolveMatrix = styled('feConvolveMatrix') as FactoryFn<DarkJSX.SVGTags['feConvolveMatrix']>;
styled.feDiffuseLighting = styled('feDiffuseLighting') as FactoryFn<DarkJSX.SVGTags['feDiffuseLighting']>;
styled.feDisplacementMap = styled('feDisplacementMap') as FactoryFn<DarkJSX.SVGTags['feDisplacementMap']>;
styled.feDistantLight = styled('feDistantLight') as FactoryFn<DarkJSX.SVGTags['feDistantLight']>;
styled.feFlood = styled('feFlood') as FactoryFn<DarkJSX.SVGTags['feFlood']>;
styled.feFuncA = styled('feFuncA') as FactoryFn<DarkJSX.SVGTags['feFuncA']>;
styled.feFuncB = styled('feFuncB') as FactoryFn<DarkJSX.SVGTags['feFuncB']>;
styled.feFuncG = styled('feFuncG') as FactoryFn<DarkJSX.SVGTags['feFuncG']>;
styled.feFuncR = styled('feFuncR') as FactoryFn<DarkJSX.SVGTags['feFuncR']>;
styled.feGaussianBlur = styled('feGaussianBlur') as FactoryFn<DarkJSX.SVGTags['feGaussianBlur']>;
styled.feImage = styled('feImage') as FactoryFn<DarkJSX.SVGTags['feImage']>;
styled.feMerge = styled('feMerge') as FactoryFn<DarkJSX.SVGTags['feMerge']>;
styled.feMergeNode = styled('feMergeNode') as FactoryFn<DarkJSX.SVGTags['feMergeNode']>;
styled.feMorphology = styled('feMorphology') as FactoryFn<DarkJSX.SVGTags['feMorphology']>;
styled.feOffset = styled('feOffset') as FactoryFn<DarkJSX.SVGTags['feOffset']>;
styled.fePointLight = styled('fePointLight') as FactoryFn<DarkJSX.SVGTags['fePointLight']>;
styled.feSpecularLighting = styled('feSpecularLighting') as FactoryFn<DarkJSX.SVGTags['feSpecularLighting']>;
styled.feSpotLight = styled('feSpotLight') as FactoryFn<DarkJSX.SVGTags['feSpotLight']>;
styled.feTile = styled('feTile') as FactoryFn<DarkJSX.SVGTags['feTile']>;
styled.feTurbulence = styled('feTurbulence') as FactoryFn<DarkJSX.SVGTags['feTurbulence']>;
styled.filter = styled('filter') as FactoryFn<DarkJSX.SVGTags['filter']>;
styled.g = styled('g') as FactoryFn<DarkJSX.SVGTags['g']>;
styled.image = styled('image') as FactoryFn<DarkJSX.SVGTags['image']>;
styled.line = styled('line') as FactoryFn<DarkJSX.SVGTags['line']>;
styled.linearGradient = styled('linearGradient') as FactoryFn<DarkJSX.SVGTags['linearGradient']>;
styled.marker = styled('marker') as FactoryFn<DarkJSX.SVGTags['marker']>;
styled.mask = styled('mask') as FactoryFn<DarkJSX.SVGTags['mask']>;
styled.path = styled('path') as FactoryFn<DarkJSX.SVGTags['path']>;
styled.pattern = styled('pattern') as FactoryFn<DarkJSX.SVGTags['pattern']>;
styled.polygon = styled('polygon') as FactoryFn<DarkJSX.SVGTags['polygon']>;
styled.polyline = styled('polyline') as FactoryFn<DarkJSX.SVGTags['polyline']>;
styled.radialGradient = styled('radialGradient') as FactoryFn<DarkJSX.SVGTags['radialGradient']>;
styled.rect = styled('rect') as FactoryFn<DarkJSX.SVGTags['rect']>;
styled.stop = styled('stop') as FactoryFn<DarkJSX.SVGTags['stop']>;
styled.svg = styled('svg') as FactoryFn<DarkJSX.SVGTags['svg']>;
styled.switch = styled('switch') as FactoryFn<DarkJSX.SVGTags['switch']>;
styled.symbol = styled('symbol') as FactoryFn<DarkJSX.SVGTags['symbol']>;
styled.text = styled('text') as FactoryFn<DarkJSX.SVGTags['text']>;
styled.textPath = styled('textPath') as FactoryFn<DarkJSX.SVGTags['textPath']>;
styled.tspan = styled('tspan') as FactoryFn<DarkJSX.SVGTags['tspan']>;
styled.use = styled('use') as FactoryFn<DarkJSX.SVGTags['use']>;
styled.view = styled('view') as FactoryFn<DarkJSX.SVGTags['view']>;

export { setupGlobal, styled, css, inject, reuse, getTag, filterArgs, detectIsStyled };
