import { NodeType, detectIsBoolean, detectIsString } from '@dark-engine/core';
import { detectIsVoidElement } from '../dom';

class NativeElement {
  public type: NodeType;
  public parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  public renderToString(isRoot?: boolean) {
    return this.type as string;
  }

  public renderToChunk(start?: boolean, close?: boolean) {
    return this.type as string;
  }
}

class TagNativeElement extends NativeElement {
  public name: string = null;
  public attrs: Record<string, AttributeValue> = {};
  public children: Array<NativeElement> = [];

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;
  }

  public appendChild(element: NativeElement) {
    element.parentElement = this;
    this.children.push(element);
  }

  public setAttribute(name: string, value: AttributeValue) {
    this.attrs[name] = detectIsString(value) ? escape(value) : value;
  }

  public override renderToString(isRoot: boolean): string {
    const isVoid = detectIsVoidElement(this.name);
    const attrs = getAttributes(this.attrs);

    if (isVoid) return `<${this.name}${attrs}>`;

    const children = this.children.map(x => x.renderToString()).join('');
    const value = isRoot ? children : `<${this.name}${attrs}>${children}</${this.name}>`;

    return value;
  }

  public override renderToChunk(start: boolean, close?: boolean): string {
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

  public override renderToString(): string {
    return this.value;
  }

  public override renderToChunk(): string {
    return this.value;
  }
}

class CommentNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = `<!--${escape(text)}-->`;
  }

  public override renderToString(): string {
    return this.value;
  }

  public override renderToChunk(): string {
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
