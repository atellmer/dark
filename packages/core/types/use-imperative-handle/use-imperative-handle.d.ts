import type { MutableRef } from '../ref';
declare function useImperativeHandle<T>(ref: MutableRef<T>, createHandle: () => T, deps?: Array<any>): void;
export { useImperativeHandle };
