import { Component, StandardComponentProps } from '../component';
import useMemo from '../hooks/use-memo';
import { VirtualNode } from '../vdom/vnode';
import { isObject, isNull } from '@helpers';


export type MutableRef<T = any> = {
  current: T;
};

function forwardRef<T extends StandardComponentProps>(component: Component<Omit<T, 'ref'>>) {
  return ({ ref, ...rest }: T) => {
    return component(rest, ref);
  }
}

function hasRef(vNode: VirtualNode): boolean {
  return isObject(vNode.ref) && !isNull(vNode.ref);
}

function useRef<T>(initialValue: T = null): MutableRef<T> {
  const ref: MutableRef<T> = useMemo(() => ({ current: initialValue }), []);

  return ref;
}

function useImperativeHandle(ref: MutableRef, createHandle: () => object, deps: Array<any>) {
  const current = useMemo(() => createHandle(), deps);

  ref.current = current;
}

export {
  forwardRef,
  hasRef,
  useRef,
  useImperativeHandle,
};
