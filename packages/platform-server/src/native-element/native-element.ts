import { NodeType, detectIsBoolean, detectIsString } from '@dark-engine/core';
import {
  type AttributeValue,
  AS_ATTR,
  CLASS_ATTR,
  CLASS_NAME_ATTR,
  EXCLUDE_ATTR_MARK,
  TEXTAREA_TAG,
  VALUE_ATTR,
  DANGER_HTML_ATTR,
  detectIsVoidElement,
} from '@dark-engine/platform-browser';

import { illegal, escape } from '../utils';

abstract class NativeElement {
  type: NodeType;
  parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  abstract render(): string;
  abstract render(isOpening: boolean): string;

  abstract renderToString(): string;
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
    if (this.attrs[DANGER_HTML_ATTR]) {
      illegal(`The element with danger content can't have a children!`);
    }

    element.parentElement = this;
    this.children.push(element);
  }

  setAttribute(name: string, value: AttributeValue) {
    let $name = name === CLASS_NAME_ATTR ? CLASS_ATTR : name;

    if ($name[0] === EXCLUDE_ATTR_MARK) return;
    if ($name === AS_ATTR) $name = name.slice(1, AS_ATTR.length);
    this.attrs[$name] = detectIsString(value) && $name !== DANGER_HTML_ATTR ? escape(value) : value;
  }

  override render(...args: Array<unknown>) {
    const isOpening = args[0] as boolean;
    const content =
      this.name === TEXTAREA_TAG
        ? (this.attrs[VALUE_ATTR] as string) || ''
        : (this.attrs[DANGER_HTML_ATTR] as string) || '';
    const isVoid = detectIsVoidElement(this.name);
    const attrs = getAttributes(this.attrs);
    const chunk = isOpening
      ? isVoid
        ? `<${this.name}${attrs}>`
        : `<${this.name}${attrs}>${content || ''}`
      : isVoid
      ? ''
      : `</${this.name}>`;

    return chunk;
  }

  override renderToString() {
    const content = this.children.map(x => x.renderToString()).join('');

    return this.render(true) + content + this.render(false);
  }
}

class TextNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this.value = escape(text);
  }

  override render() {
    return this.value;
  }

  override renderToString() {
    return this.render();
  }
}

class CommentNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = `<!--${escape(text)}-->`;
  }

  override render() {
    return this.value;
  }

  override renderToString() {
    return this.render();
  }
}

function getAttributes(map: TagNativeElement['attrs']) {
  let attrs = '';

  for (const key of Object.keys(map)) {
    if (key === DANGER_HTML_ATTR) continue;
    const attr = ' ' + (detectIsBoolean(map[key]) ? (map[key] === true ? key : '') : `${key}="${map[key]}"`);

    attrs += attr;
  }

  return attrs;
}

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement };
