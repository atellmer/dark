import { detectIsComponent } from '../component';

const $$lazy = Symbol('lazy');
const $$loaded = Symbol('loaded');

const detectIsLazy = (instance: unknown) => detectIsComponent(instance) && instance.token === $$lazy;

const detectIsLoaded = (instance: unknown) => detectIsComponent(instance) && instance.type[$$loaded];

export { $$lazy, $$loaded, detectIsLazy, detectIsLoaded };
