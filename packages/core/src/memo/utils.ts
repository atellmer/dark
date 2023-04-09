import { detectIsComponent } from '../component';

const $$memo = Symbol('memo');

const detectIsMemo = (instance: unknown) => detectIsComponent(instance) && instance.token === $$memo;

export { $$memo, detectIsMemo };
