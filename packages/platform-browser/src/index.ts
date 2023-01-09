/// <reference path="jsx.d.ts" />
export type { SyntheticEvent } from './events';
export { render } from './render';
export { createRoot } from './create-root';
export { hydrateRoot } from './hydrate-root';
export { createPortal } from './portal';
export { useStyle } from './use-style';
export { setTrackUpdate } from './dom';
export * from './factory';

export const version = process.env.VERSION;
