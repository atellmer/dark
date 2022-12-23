import { detectIsBoolean } from '@dark-engine/core';
import { NodeType } from '@dark-engine/core';

class NativeElement {
  public type: NodeType;
  public parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  public toString(isRoot = false) {
    let content = '';

    if (this instanceof TextNativeElement || this instanceof CommentNativeElement) {
      content = this.value;
    } else if (this instanceof TagNativeElement) {
      const map = this.attrs;
      const attrs = Object.keys(map).reduce((acc, key) => {
        const attr = ' ' + (detectIsBoolean(map[key]) ? (map[key] === true ? key : '') : `${key}="${map[key]}"`);

        acc += attr;

        return acc;
      }, '');
      const children = this.children.map(x => x.toString()).join('');

      content = isRoot ? children : `<${this.name}${attrs}>${children}</${this.name}>`;
    }

    return content;
  }
}

export type AttributeValue = string | number | boolean;

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
    this.attrs[name] = value;
  }
}

class TextNativeElement extends NativeElement {
  public value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this.value = text;
  }
}

class CommentNativeElement extends NativeElement {
  public value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = `<!--${text}-->`;
  }
}

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement };
