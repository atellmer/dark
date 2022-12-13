import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

const html = factory('html');
const body = factory('body');
const base = factory('base');
const head = factory('head');
const link = factory('link');
const meta = factory('meta');
const style = factory('style');
const title = factory('title');
const address = factory('address');
const article = factory('article');
const aside = factory('aside');
const footer = factory('footer');
const header = factory('header');
const h1 = factory('h1');
const h2 = factory('h2');
const h3 = factory('h3');
const h4 = factory('h4');
const h5 = factory('h5');
const h6 = factory('h6');
const nav = factory('nav');
const section = factory('section');
const div = factory('div');
const dd = factory('dd');
const dl = factory('dl');
const figcaption = factory('figcaption');
const figure = factory('figure');
const picture = factory('picture');
const hr = factory('hr');
const img = factory('img');
const li = factory('li');
const main = factory('main');
const ol = factory('ol');
const p = factory('p');
const pre = factory('pre');
const ul = factory('ul');
const a = factory('a');
const b = factory('b');
const abbr = factory('abbr');
const bdi = factory('bdi');
const bdo = factory('bdo');
const br = factory('br');
const cite = factory('cite');
const code = factory('code');
const data = factory('data');
const dfn = factory('dfn');
const em = factory('em');
const i = factory('i');
const kbd = factory('kbd');
const mark = factory('mark');
const q = factory('q');
const rp = factory('rp');
const rt = factory('rt');
const ruby = factory('ruby');
const s = factory('s');
const samp = factory('samp');
const small = factory('small');
const span = factory('span');
const strong = factory('strong');
const sub = factory('sub');
const sup = factory('sup');
const time = factory('time');
const u = factory('u');
const _var = factory('var');
const wbr = factory('wbr');
const area = factory('area');
const audio = factory('audio');
const map = factory('map');
const track = factory('track');
const video = factory('video');
const embed = factory('embed');
const object = factory('object');
const param = factory('param');
const source = factory('source');
const canvas = factory('canvas');
const script = factory('script');
const noscript = factory('noscript');
const del = factory('del');
const ins = factory('ins');
const caption = factory('caption');
const col = factory('col');
const colgroup = factory('colgroup');
const table = factory('table');
const thead = factory('thead');
const tbody = factory('tbody');
const td = factory('td');
const th = factory('th');
const tr = factory('tr');
const button = factory('button');
const datalist = factory('datalist');
const fieldset = factory('fieldset');
const form = factory('form');
const input = factory('input');
const label = factory('label');
const legend = factory('legend');
const meter = factory('meter');
const optgroup = factory('optgroup');
const option = factory('option');
const output = factory('output');
const progress = factory('progress');
const select = factory('select');
const textarea = factory('textarea');
const details = factory('details');
const dialog = factory('dialog');
const menu = factory('menu');
const summary = factory('summary');
const template = factory('template');
const blockquote = factory('blockquote');
const iframe = factory('iframe');
const tfoot = factory('tfoot');
const svg = factory('svg');
const animate = factory('animate');
const animateMotion = factory('animateMotion');
const animateTransform = factory('animateTransform');
const circle = factory('circle');
const clipPath = factory('clipPath');
const defs = factory('defs');
const desc = factory('desc');
const ellipse = factory('ellipse');
const feBlend = factory('feBlend');
const feColorMatrix = factory('feColorMatrix');
const feComponentTransfer = factory('feComponentTransfer');
const feComposite = factory('feComposite');
const feConvolveMatrix = factory('feConvolveMatrix');
const feDiffuseLighting = factory('feDiffuseLighting');
const feDisplacementMap = factory('feDisplacementMap');
const feDistantLight = factory('feDistantLight');
const feDropShadow = factory('feDropShadow');
const feFlood = factory('feFlood');
const feFuncA = factory('feFuncA');
const feFuncB = factory('feFuncB');
const feFuncG = factory('feFuncG');
const feFuncR = factory('feFuncR');
const feGaussianBlur = factory('feGaussianBlur');
const feImage = factory('feImage');
const feMerge = factory('feMerge');
const feMergeNode = factory('feMergeNode');
const feMorphology = factory('feMorphology');
const feOffset = factory('feOffset');
const fePointLight = factory('fePointLight');
const feSpecularLighting = factory('feSpecularLighting');
const feSpotLight = factory('feSpotLight');
const feTile = factory('feTile');
const feTurbulence = factory('feTurbulence');
const filter = factory('filter');
const foreignObject = factory('foreignObject');
const g = factory('g');
const image = factory('image');
const line = factory('line');
const linearGradient = factory('linearGradient');
const marker = factory('marker');
const mask = factory('mask');
const metadata = factory('metadata');
const mpath = factory('mpath');
const path = factory('path');
const pattern = factory('pattern');
const polygon = factory('polygon');
const polyline = factory('polyline');
const radialGradient = factory('radialGradient');
const rect = factory('rect');
const stop = factory('stop');
const _switch = factory('switch');
const symbol = factory('symbol');
const text = factory('text');
const textPath = factory('textPath');
const tspan = factory('tspan');
const use = factory('use');
const view = factory('view');

export {
  factory,
  html,
  body,
  base,
  head,
  link,
  meta,
  style,
  title,
  address,
  article,
  aside,
  footer,
  header,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  nav,
  section,
  div,
  dd,
  dl,
  figcaption,
  figure,
  picture,
  hr,
  img,
  li,
  main,
  ol,
  p,
  pre,
  ul,
  a,
  b,
  abbr,
  bdi,
  bdo,
  br,
  cite,
  code,
  data,
  dfn,
  em,
  i,
  kbd,
  mark,
  q,
  rp,
  rt,
  ruby,
  s,
  samp,
  small,
  span,
  strong,
  sub,
  sup,
  time,
  u,
  _var,
  wbr,
  area,
  audio,
  map,
  track,
  video,
  embed,
  object,
  param,
  source,
  canvas,
  script,
  noscript,
  del,
  ins,
  caption,
  col,
  colgroup,
  table,
  thead,
  tbody,
  td,
  th,
  tr,
  button,
  datalist,
  fieldset,
  form,
  input,
  label,
  legend,
  meter,
  optgroup,
  option,
  output,
  progress,
  select,
  textarea,
  details,
  dialog,
  menu,
  summary,
  template,
  blockquote,
  iframe,
  tfoot,
  svg,
  animate,
  animateMotion,
  animateTransform,
  circle,
  clipPath,
  defs,
  desc,
  ellipse,
  feBlend,
  feColorMatrix,
  feComponentTransfer,
  feComposite,
  feConvolveMatrix,
  feDiffuseLighting,
  feDisplacementMap,
  feDistantLight,
  feDropShadow,
  feFlood,
  feFuncA,
  feFuncB,
  feFuncG,
  feFuncR,
  feGaussianBlur,
  feImage,
  feMerge,
  feMergeNode,
  feMorphology,
  feOffset,
  fePointLight,
  feSpecularLighting,
  feSpotLight,
  feTile,
  feTurbulence,
  filter,
  foreignObject,
  g,
  image,
  line,
  linearGradient,
  marker,
  mask,
  metadata,
  mpath,
  path,
  pattern,
  polygon,
  polyline,
  radialGradient,
  rect,
  stop,
  _switch,
  symbol,
  text,
  textPath,
  tspan,
  use,
  view,
};
