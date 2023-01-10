/// <reference path="jsx.ts" />
export { type SyntheticEvent } from './events';
export { run } from './render';
export { registerElement } from './registry';
export * from './components';
export * from './native-element';
export * as NS from './jsx';

export const version = process.env.VERSION;
