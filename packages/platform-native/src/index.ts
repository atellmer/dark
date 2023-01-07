/* eslint-disable @typescript-eslint/no-namespace */
export { type SyntheticEvent } from './events';
export { run } from './render';
export { registerElement } from './registry';

export const version = process.env.VERSION;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [elementName: string]: any;
    }
  }
}
