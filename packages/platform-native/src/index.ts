/// <reference path="jsx.d.ts" />
export { type SyntheticEvent } from './events';
export { run } from './render';
export { registerElement } from './registry';
export * from './components';
export * from './native-element';

export const version = process.env.VERSION;
