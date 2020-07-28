import { createComponent, detectIsComponentFactory } from '../component';
import { detectIsVirtualNode, setAttribute } from '../view';
import { ATTR_KEY } from '../constants';
import { isEmpty, isArray, isFunction } from '@helpers';
import { DarkElementKey, DarkElement } from '../shared/model';


const $$fragment = Symbol('fragment');

function setKey(element: DarkElement, key: DarkElementKey) {
	if (detectIsComponentFactory(element)) {
		element.props[ATTR_KEY] = key;
	} else if (detectIsVirtualNode(element)) {
		setAttribute(element, ATTR_KEY, key);
	}
}

const Fragment = createComponent(
	({ key, slot }) => {
		if (!isEmpty(key) && Boolean(slot)) {
			if (isArray(slot)) {
				for (let i = 0; i < slot.length; i++) {
					setKey(slot[i], `${key}:${i}`);
				}
			} else if (!isFunction(slot)) {
				setKey(slot, key);
			}
		}

		return slot || null;
	},
	{ token: $$fragment },
);

const detectIsFragment = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$fragment;

export {
  Fragment,
  detectIsFragment,
};
