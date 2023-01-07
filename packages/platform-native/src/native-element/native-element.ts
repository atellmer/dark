import { NodeType, detectIsNumber, ROOT, detectIsFunction } from '@dark-engine/core';
import { createSyntheticEventHandler } from '../events';
import { NSViewFlag, getElement, type ElementFactory, type NSElementMeta } from '../registry';
import { ATTR_TEXT } from '../constants';

class NativeElement {
  public type: NodeType;
  public parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagNativeElement extends NativeElement {
  public name: string = null;
  public attrs: Record<string, AttributeValue> = {};
  public children: Array<NativeElement> = [];
  public nativeView: ElementFactory;
  public meta: NSElementMeta = {};
  private eventListeners: Map<string, Function> = new Map();

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;

    const { factory, meta = {} } = getElement(name);

    if (!meta?.skipNativeInstalling) {
      this.nativeView = new factory();
    }

    this.meta = meta;
  }

  public getNativeView() {
    if (this.name === ROOT) {
      const tag = this.children[0] as TagNativeElement;

      return tag.getNativeView();
    }

    return this.nativeView;
  }

  public appendChild(element: NativeElement) {
    element.parentElement = this;
    this.children.push(element);

    if (element.type === NodeType.TAG) {
      appendToNativeContainer(element as TagNativeElement, this);
    } else if (element.type === NodeType.TEXT) {
      this.updateText();
    }
  }

  insertBefore(element: NativeElement, siblingElement: NativeElement) {
    if (!siblingElement) {
      return this.appendChild(element);
    }

    const idx = this.children.findIndex(node => node === siblingElement);

    if (idx === -1) {
      return this.appendChild(element);
    }

    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }

    this.children.splice(idx, 0, element);
    element.parentElement = this;

    if (element.type === NodeType.TAG) {
      const idx = this.children.filter(node => node.type === NodeType.TAG).findIndex(node => node === element);

      appendToNativeContainer(element as TagNativeElement, this, idx);
    } else if (element.type === NodeType.TEXT) {
      this.updateText();
    }
  }

  removeChild(element: NativeElement) {
    const idx = this.children.findIndex(node => node === element);

    if (idx !== -1) {
      this.children.splice(idx, 1);
      element.parentElement = null;

      if (element.type === NodeType.TAG) {
        removeFromNativeContainer(element as TagNativeElement, this);
      } else if (element.type === NodeType.TEXT) {
        this.updateText();
      }
    }
  }

  public getAttribute(name: string): AttributeValue {
    return this.attrs[name];
  }

  public setAttribute(name: string, value: AttributeValue) {
    this.attrs[name] = value;
    this.nativeView[name] = value;
  }

  public removeAttribute(name: string) {
    delete this.attrs[name];
    delete this.nativeView[name];
  }

  public updateText() {
    let text = '';

    for (const child of this.children) {
      if (child.type === NodeType.TEXT) {
        text += (child as TextNativeElement).value;
      }
    }

    this.setAttribute(ATTR_TEXT, text);
  }

  dispatchEvent(eventName: string) {
    this.nativeView.notify({ eventName, object: this.nativeView });
  }

  addEventListener(eventName: string, handler: Function) {
    const syntheticHandler = createSyntheticEventHandler(handler);

    this.removeEventListener(eventName);
    this.eventListeners.set(eventName, syntheticHandler);
    this.nativeView.addEventListener(eventName, syntheticHandler);
  }

  removeEventListener(eventName: string) {
    const handler = this.eventListeners.get(eventName);

    this.eventListeners.delete(eventName);
    handler && this.nativeView.removeEventListener(eventName, handler);
  }
}

class TextNativeElement extends NativeElement {
  private _value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this._value = text;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;

    if (this.parentElement?.type === NodeType.TAG) {
      this.parentElement.updateText();
    }
  }
}

class CommentNativeElement extends NativeElement {
  private _value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this._value = `<!--${text}-->`;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }
}

function appendToNativeContainer(childElement: TagNativeElement, parentElement: TagNativeElement, idx?: number) {
  const { meta } = parentElement;

  if (meta.skipNativeInstalling) return;

  if (detectIsFunction(meta.add)) {
    return meta.add(childElement, parentElement, idx);
  }

  const parentView = parentElement.nativeView;
  const childView = childElement.nativeView;

  if (parentElement)
    if (meta.flag === NSViewFlag.LAYOUT_VIEW) {
      if (detectIsNumber(idx)) {
        parentView.insertChild(childView, idx);
      } else {
        parentView.addChild(childView);
      }
    } else if (meta.flag === NSViewFlag.CONTENT_VIEW) {
      parentView.content = childView;
    } else {
      parentView._addChildFromBuilder(childView.constructor.name, childView);
    }
}

function removeFromNativeContainer(childElement: TagNativeElement, parentElement: TagNativeElement) {
  const { meta } = parentElement;

  if (meta.skipNativeInstalling) return;

  if (detectIsFunction(meta.remove)) {
    return meta.remove(childElement, parentElement);
  }

  const parentView = parentElement.nativeView;
  const childView = childElement.nativeView;

  if (meta.flag == NSViewFlag.LAYOUT_VIEW) {
    parentView.removeChild(childView);
  } else if (meta.flag === NSViewFlag.CONTENT_VIEW) {
    parentView.content = null;
  } else {
    parentView._removeView(childView);
  }
}

export type AttributeValue = string | number | boolean;

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement };
