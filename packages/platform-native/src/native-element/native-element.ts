import { NodeType, ATTR_REF, detectIsNumber } from '@dark-engine/core';
import {
  Frame,
  Page,
  ContentView,
  ScrollView,
  RootLayout,
  AbsoluteLayout,
  DockLayout,
  FlexboxLayout,
  StackLayout,
  GridLayout,
  WrapLayout,
  HtmlView,
  WebView,
  Label,
  Button,
} from '@nativescript/core';

const enum NSViewFlag {
  FRAME = 'FRAME',
  CONTENT_VIEW = 'CONTENT_VIEW',
  LAYOUT_VIEW = 'LAYOUT_VIEW',
}

type ElementFactory = any;

type NSElement = {
  factory: ElementFactory;
  flag: NSViewFlag;
};

const viewMap: Record<string, NSElement> = {};

function registerElement(name: string, factory: ElementFactory, flag?: NSViewFlag) {
  viewMap[name] = { factory, flag };
}

function getElement(name: string): NSElement {
  return viewMap[name] || null;
}

registerElement('frame', Frame, NSViewFlag.FRAME);

registerElement('page', Page, NSViewFlag.CONTENT_VIEW);
registerElement('content-view', ContentView, NSViewFlag.CONTENT_VIEW);
registerElement('scroll-view', ScrollView, NSViewFlag.CONTENT_VIEW);

registerElement('root-layout', RootLayout, NSViewFlag.LAYOUT_VIEW);
registerElement('absolute-layout', AbsoluteLayout, NSViewFlag.LAYOUT_VIEW);
registerElement('dock-layout', DockLayout, NSViewFlag.LAYOUT_VIEW);
registerElement('flexbox-layout', FlexboxLayout, NSViewFlag.LAYOUT_VIEW);
registerElement('grid-layout', GridLayout, NSViewFlag.LAYOUT_VIEW);
registerElement('stack-layout', StackLayout, NSViewFlag.LAYOUT_VIEW);
registerElement('wrap-layout', WrapLayout, NSViewFlag.LAYOUT_VIEW);

registerElement('html-view', HtmlView);
registerElement('web-view', WebView);

registerElement('button', Button);
registerElement('label', Label);

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
  public flag: NSViewFlag;

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;
    const { factory, flag } = getElement(name);

    this.nativeView = new factory();
    this.nativeView[ATTR_REF] = this;
    this.flag = flag;
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

    if (idx > -1) {
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

    this.setAttribute('text', text);
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
  const parentView = parentElement.nativeView;
  const childView = childElement.nativeView;

  if (parentElement.flag === NSViewFlag.LAYOUT_VIEW) {
    if (detectIsNumber(idx)) {
      parentView.insertChild(childView, idx);
    } else {
      parentView.addChild(childView);
    }
  } else if (parentElement.flag === NSViewFlag.CONTENT_VIEW) {
    parentView.content = childView;
  } else {
    parentView._addChildFromBuilder(childView.constructor.name, childView);
  }
}

function removeFromNativeContainer(childElement: TagNativeElement, parentElement: TagNativeElement) {
  const parentView = parentElement.nativeView;
  const childView = childElement.nativeView;

  if (parentElement.flag == NSViewFlag.LAYOUT_VIEW) {
    parentView.removeChild(childView);
  } else if (parentElement.flag === NSViewFlag.CONTENT_VIEW) {
    parentView.content = null;
  } else {
    parentView._removeView(childView);
  }
}

export type AttributeValue = string | number | boolean;

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement };
