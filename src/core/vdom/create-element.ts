import { isNumber, isString } from '@helpers';
import { Text, View } from './vnode';

function getChildren(children) {
  children = children.map(x => (isString(x) || isNumber(x) ? Text(x.toString()) : x));
  return Boolean(children) ? (Array.isArray(children) ? [...children] : [children]) : [];
}

function createElement(tag: string | Function, props: any, ...children: Array<any>) {
  if (typeof tag === 'string') {
    return View({
      ...props,
      as: tag,
      slot: getChildren(children),
    });
  }

  if (typeof tag === 'function') {
    const Component = tag;
    let slot = getChildren(children);
    slot = slot.length === 1 ? slot[0] : slot;

    return Component({
      ...props,
      slot,
    });
  }

  return null;
}

export {
  createElement, //
};
