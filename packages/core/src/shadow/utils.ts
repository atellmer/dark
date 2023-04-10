import { detectIsComponent } from '../component';

const $$shadow = Symbol('shadow');

const detectIsShadow = (instance: unknown) => detectIsComponent(instance) && instance.token === $$shadow;

export { $$shadow, detectIsShadow };
