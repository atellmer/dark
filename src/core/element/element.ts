import {
  isNumber,
  isString,
  isFunction,
} from '@helpers';
import { View, Text } from '@core/view';


function getChildren(children: Array<any>) {
  children = children.map(x => (isString(x) || isNumber(x) ? Text(x.toString()) : x));

  return Boolean(children) ? (Array.isArray(children) ? [...children] : [children]) : [];
}

function createElement(tag: string | Function, props: any, ...children: Array<any>) {
  if (isString(tag)) {
    return View({
      ...props,
      as: tag,
      slot: getChildren(children),
    });
  }

  if (isFunction(tag)) {
    let slot = getChildren(children);

    slot = slot.length === 1 ? slot[0] : slot;

    return tag({ ...props, slot });
  }

  return null;
}

export {
  createElement,
};
