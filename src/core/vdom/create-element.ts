import { Text, View } from './vnode';

function getChildren(children) {
  children = children.map(x => typeof x === 'string' ? Text(x) : x);
  return Boolean(children) ? (Array.isArray(children) ? [...children] : [children]) : [];
}

function createElement(tag: string | Function, props: any, ...children: Array<any>) {

  if (typeof tag === 'string') {
    return View({
      ...props,
      as: tag,
      children: getChildren(children),
    });
  }

  if (typeof tag === 'function') {
    const Component = tag;

    return Component({
      ...props,
      children: getChildren(children)
    });
  }

  return null;
}

export {
  createElement, //
};
