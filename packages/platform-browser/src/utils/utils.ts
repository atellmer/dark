import { detectIsUndefined, illegal as $illegal } from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';
import { LIB } from '../constants';

const svgTagNames = new Set([
  'svg',
  'animate',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tspan',
  'use',
  'view',
]);
const voidTagNames = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const detectIsSvgElement = (name: string) => svgTagNames.has(name);

const detectIsVoidElement = (name: string) => voidTagNames.has(name);

const detectIsBrowser = () => !detectIsUndefined(globalThis.window);

const illegal = (x: string) => $illegal(x, LIB);

const removeContent = (element: TagNativeElement) => (element.innerHTML = '');

const setInnerHTML = (element: TagNativeElement, html: string) =>
  element.innerHTML !== html && (element.innerHTML = html);

export { detectIsSvgElement, detectIsVoidElement, detectIsBrowser, illegal, removeContent, setInnerHTML };
