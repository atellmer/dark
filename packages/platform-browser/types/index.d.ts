export type { SyntheticEvent } from './events';
export { render } from './render';
export { createRoot } from './create-root';
export { createPortal } from './portal';
export { useStyle } from './use-style';
export { setTrackUpdate } from './dom';
export * from './factory';
export declare const version: string;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
