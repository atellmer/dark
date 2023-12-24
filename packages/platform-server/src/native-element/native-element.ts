import { NodeType, detectIsBoolean, detectIsString } from '@dark-engine/core';

import { detectIsVoidElement } from '../utils';
import { CLASS_ATTR, CLASS_NAME_ATTR } from '../constants';

class NativeElement {
  type: NodeType;
  parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  renderToString(isRoot?: boolean) {
    return this.type as string;
  }

  renderToChunk(start?: boolean, close?: boolean) {
    return this.type as string;
  }
}

class TagNativeElement extends NativeElement {
  name: string = null;
  attrs: Record<string, AttributeValue> = {};
  children: Array<NativeElement> = [];

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;
  }

  appendChild(element: NativeElement) {
    element.parentElement = this;
    this.children.push(element);
  }

  setAttribute(name: string, value: AttributeValue) {
    const $name = name === CLASS_NAME_ATTR ? CLASS_ATTR : name;

    this.attrs[$name] = detectIsString(value) ? escape(value) : value;
  }

  override renderToString(isRoot: boolean): string {
    const isVoid = detectIsVoidElement(this.name);
    const attrs = getAttributes(this.attrs);

    if (isVoid) return `<${this.name}${attrs}>`;

    const children = this.children.map(x => x.renderToString()).join('');
    const value = isRoot ? children : `<${this.name}${attrs}>${children}</${this.name}>`;

    return value;
  }

  override renderToChunk(start: boolean, close?: boolean): string {
    const isVoid = detectIsVoidElement(this.name);
    const attrs = getAttributes(this.attrs);

    return start
      ? close
        ? `<${this.name}${attrs}></${this.name}>`
        : `<${this.name}${attrs}>`
      : isVoid
      ? ''
      : `</${this.name}>`;
  }
}

class TextNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this.value = escape(text);
  }

  override renderToString(): string {
    return this.value;
  }

  override renderToChunk(): string {
    return this.value;
  }
}

class CommentNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = `<!--${escape(text)}-->`;
  }

  override renderToString(): string {
    return this.value;
  }

  override renderToChunk(): string {
    return this.value;
  }
}

function getAttributes(map: TagNativeElement['attrs']) {
  let attrs = '';

  for (const key of Object.keys(map)) {
    const attr = ' ' + (detectIsBoolean(map[key]) ? (map[key] === true ? key : '') : `${key}="${map[key]}"`);

    attrs += attr;
  }

  return attrs;
}

function escape(value: string) {
  return value
    .split('')
    .map(x => escapeChar(x))
    .join('');
}

function escapeChar(char: string) {
  switch (char) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    default:
      return char;
  }
}

export type AttributeValue = string | number | boolean;

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement };
