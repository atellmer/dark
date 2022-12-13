import { type ViewDef } from '@dark-engine/core';
declare type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;
declare const factory: (as: string) => (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const html: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const body: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const base: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const head: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const link: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const meta: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const style: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const title: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const address: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const article: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const aside: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const footer: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const header: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const h1: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const h2: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const h3: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const h4: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const h5: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const h6: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const nav: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const section: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const div: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const dd: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const dl: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const figcaption: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const figure: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const picture: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const hr: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const img: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const li: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const main: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const ol: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const p: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const pre: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const ul: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const a: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const b: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const abbr: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const bdi: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const bdo: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const br: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const cite: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const code: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const data: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const dfn: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const em: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const i: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const kbd: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const mark: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const q: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const rp: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const rt: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const ruby: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const s: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const samp: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const small: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const span: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const strong: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const sub: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const sup: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const time: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const u: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const _var: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const wbr: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const area: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const audio: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const map: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const track: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const video: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const embed: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const object: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const param: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const source: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const canvas: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const script: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const noscript: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const del: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const ins: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const caption: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const col: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const colgroup: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const table: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const thead: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const tbody: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const td: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const th: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const tr: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const button: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const datalist: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const fieldset: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const form: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const input: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const label: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const legend: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const meter: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const optgroup: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const option: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const output: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const progress: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const select: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const textarea: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const details: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const dialog: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const menu: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const summary: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const template: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const blockquote: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const iframe: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const tfoot: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const svg: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const animate: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const animateMotion: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const animateTransform: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const circle: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const clipPath: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const defs: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const desc: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const ellipse: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feBlend: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feColorMatrix: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feComponentTransfer: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feComposite: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feConvolveMatrix: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feDiffuseLighting: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feDisplacementMap: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feDistantLight: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feDropShadow: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feFlood: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feFuncA: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feFuncB: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feFuncG: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feFuncR: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feGaussianBlur: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feImage: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feMerge: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feMergeNode: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feMorphology: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feOffset: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const fePointLight: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feSpecularLighting: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feSpotLight: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feTile: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const feTurbulence: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const filter: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const foreignObject: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const g: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const image: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const line: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const linearGradient: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const marker: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const mask: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const metadata: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const mpath: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const path: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const pattern: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const polygon: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const polyline: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const radialGradient: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const rect: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const stop: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const _switch: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const symbol: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const text: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const textPath: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const tspan: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const use: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
declare const view: (props?: TagProps) => import('@dark-engine/core').TagVirtualNodeFactory;
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
