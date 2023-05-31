import { type WidgetEventTypes, QWidget } from '@nodegui/nodegui';
import { NodeType, ROOT, detectIsFunction, detectIsNumber } from '@dark-engine/core';

import { createSyntheticEventHandler } from '../events';
import { getElementFactory, NGViewFlag, type NGElement, type NGElementMeta } from '../registry';
import { ATTR_TEXT } from '../constants';
import { createSetterName } from '../utils';
import { type Size, type Position, type WidgetProps } from '../shared';
import { QFlexLayout } from '../components/view';

class NativeElement {
  public type: NodeType;
  public parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  public getText(): string {
    return this.type;
  }
}
class TagNativeElement<T extends NGElement = NGElement> extends NativeElement {
  public name: string = null;
  public attrs: Record<string, AttributeValue> = {};
  public children: Array<NativeElement> = [];
  private nativeView: T;
  private meta: NGElementMeta;
  private eventListeners: Map<string, (e: any) => void> = new Map();

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;

    const { create, meta } = getElementFactory(name);

    this.nativeView = create() as T;
    this.meta = meta;
    detectIsFunction(this.meta.setup) && this.meta.setup(this);
  }

  public getNativeView(): T {
    if (this.name === ROOT) {
      const tag = this.children[0] as TagNativeElement;

      return tag.getNativeView() as T;
    }

    return this.nativeView;
  }

  public getMeta(): NGElementMeta {
    return this.meta;
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
    const setterName = createSetterName(name);

    detectIsFunction(this.meta.attrSetter)
      ? this.meta.attrSetter(this, name, value)
      : defaultAttrSetter(this, name, value);

    if (!detectIsFunction(this.nativeView[setterName])) return;

    if (!this.nativeView[INITIAL_ATTR_VALUE]) {
      this.nativeView[INITIAL_ATTR_VALUE] = {};
    }

    this.nativeView[INITIAL_ATTR_VALUE][name] = this.nativeView[name];
    this.nativeView[setterName](value);
    this.attrs[name] = value;
  }

  public removeAttribute(name: string) {
    const setterName = createSetterName(name);

    if (!detectIsFunction(this.nativeView[setterName])) return;

    const initialValue = this.nativeView[INITIAL_ATTR_VALUE][name];

    this.nativeView[setterName](initialValue);
    delete this.nativeView[INITIAL_ATTR_VALUE][name];
    delete this.attrs[name];
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

  public getText() {
    return this.getAttribute(ATTR_TEXT) as string;
  }

  addEventListener(eventName: string, handler: Function) {
    const syntheticHandler = createSyntheticEventHandler(eventName, handler);

    this.removeEventListener(eventName);
    this.eventListeners.set(eventName, syntheticHandler);
    this.nativeView.addEventListener(eventName as WidgetEventTypes, syntheticHandler);
  }

  removeEventListener(eventName: string) {
    const handler = this.eventListeners.get(eventName);

    this.eventListeners.delete(eventName);
    this.nativeView.removeEventListener(eventName as WidgetEventTypes, handler);
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

  public getText() {
    return this._value;
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

  public getText() {
    return this._value;
  }
}

function appendToNativeContainer(childElement: TagNativeElement, parentElement: TagNativeElement, idx?: number) {
  const meta = parentElement.getMeta();

  if (meta.isRoot || meta.flag === NGViewFlag.NO_CHILDREN) return;

  if (detectIsFunction(meta.add)) {
    return meta.add(childElement, parentElement, idx);
  }

  const parentView = parentElement.getNativeView();
  const childView = childElement.getNativeView();

  if (parentView instanceof QFlexLayout) {
    const layoutView = parentView as QFlexLayout;
    const child = childView as QWidget;

    if (detectIsNumber(idx)) {
      const beforeChild = (parentElement.children[idx] as TagNativeElement).getNativeView() as QWidget;

      layoutView.getFlexLayout().insertChildBefore(child, beforeChild);
    } else {
      layoutView.getFlexLayout().addWidget(child);
    }

    child.show();
  }
}

function removeFromNativeContainer(childElement: TagNativeElement, parentElement: TagNativeElement) {
  const meta = parentElement.getMeta();

  if (meta.isRoot || meta.flag === NGViewFlag.NO_CHILDREN) return;

  if (detectIsFunction(meta.remove)) {
    return meta.remove(childElement, parentElement);
  }

  const parentView = parentElement.getNativeView();
  const childView = childElement.getNativeView();

  if (parentView instanceof QFlexLayout) {
    const layoutView = parentView as QFlexLayout;
    const child = childView as QWidget;

    layoutView.getFlexLayout().removeWidget(child);
    child.close();
  }
}

type Setter = Partial<Record<keyof WidgetProps, (widget: QWidget, value: AttributeValue) => void>>;

function createAttrSetter(setter: Setter) {
  const map: Setter = {
    id: (w: QWidget, x: string) => w.setObjectName(x),
    width: (w: QWidget, x: number) => w.resize(x, w.height()),
    height: (w: QWidget, x: number) => w.resize(w.width(), x),
    size: (w: QWidget, x: Size) => (x.fixed ? w.setFixedSize(x.width, x.height) : w.resize(x.width, x.height)),
    minSize: (w: QWidget, x: Size) => w.setMinimumSize(x.width, x.height),
    maxSize: (w: QWidget, x: Size) => w.setMaximumSize(x.width, x.height),
    pos: (w: QWidget, x: Position) => w.move(x.x, x.y),
    style: (w: QWidget, x: string) => w.setInlineStyle(x),
    ...setter,
  };

  return (element: TagNativeElement, name: string, value: AttributeValue) => {
    const widget = element.getNativeView() as QWidget;

    if (!QWidget.isPrototypeOf(widget) && !(widget instanceof QWidget)) return;

    map[name] && map[name](widget, value);
  };
}

const defaultAttrSetter = createAttrSetter({});

export type AttributeValue = string | number | boolean | object;

export const INITIAL_ATTR_VALUE = '_INITIAL_ATTR_VALUE';

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement, createAttrSetter };
