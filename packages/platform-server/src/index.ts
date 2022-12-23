/* eslint-disable @typescript-eslint/no-namespace */
export { render } from './render';

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
