import useMemo from '../use-memo';
import { VirtualNode } from '../../vdom/vnode';
import { isObject, isNull } from '@helpers';


export type MutableRef<T = any> = {
  current: T;
};

function useRef<T>(initialValue: T = null): MutableRef<T> {
  const ref: MutableRef<T> = useMemo(() => ({ current: initialValue }), []);

  return ref;
}

function hasRef(vNode: VirtualNode): boolean {
  return isObject(vNode.ref) && !isNull(vNode.ref);
}

export { hasRef };
export default useRef;
