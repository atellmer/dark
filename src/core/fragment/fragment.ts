import { createComponent, getIsComponentFactory, ComponentFactory } from '../component';
import { isVirtualNode, setAttribute, VirtualNode } from '../vdom/vnode';
import { ATTR_KEY } from '../constants';
import { isEmpty, isArray, isFunction } from '@helpers';

const $$fragment = Symbol('fragment');

function setKey(element: ComponentFactory | VirtualNode, key: string | number) {
	if (getIsComponentFactory(element)) {
		element.props[ATTR_KEY] = key;
	} else if (isVirtualNode(element)) {
		setAttribute(element, ATTR_KEY, key);
	}
}

const Fragment = createComponent(
	({ key, slot }) => {
		if (!isEmpty(key) && Boolean(slot)) {
			if (isArray(slot)) {
				for (let i = 0; i < slot.length; i++) {
					let newKey = `${key}:${i}`;
					setKey(slot[i], newKey);
				}
			} else if (!isFunction(slot)) {
				setKey(slot, key);
			}
		}

		return slot || null;
	},
	{ elementToken: $$fragment }
);

const isFragment = (o) => o && o.elementToken === $$fragment;

export { Fragment, isFragment };
