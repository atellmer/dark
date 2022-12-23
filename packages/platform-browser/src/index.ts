/* eslint-disable @typescript-eslint/no-namespace */
export type { SyntheticEvent } from './events';
export { render } from './render';
export { createRoot } from './create-root';
export { hydrateRoot } from './hydrate-root';
export { createPortal } from './portal';
export { useStyle } from './use-style';
export { setTrackUpdate } from './dom';
export * from './factory';

export const version = process.env.VERSION;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [elemName: string]: any;
    }
  }
}
