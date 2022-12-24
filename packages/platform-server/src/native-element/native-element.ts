import { NodeType, detectIsBoolean, detectIsString } from '@dark-engine/core';

interface RenderableToString {
  toString(isRoot?: boolean): string;
}

class NativeElement {
  public type: NodeType;
  public parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagNativeElement extends NativeElement implements RenderableToString {
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

  public toString(isRoot: boolean): string {
    const attrs = getAttributes(this.attrs);
    const children = this.children.map(x => x.toString()).join('');
    const value = isRoot ? children : `<${this.name}${attrs}>${children}</${this.name}>`;

    return value;
  }
}

class TextNativeElement extends NativeElement implements RenderableToString {
  private value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this.value = escape(text);
  }

  toString(): string {
    return this.value;
  }
}

class CommentNativeElement extends NativeElement implements RenderableToString {
  private value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = `<!--${escape(text)}-->`;
  }

  toString(): string {
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
