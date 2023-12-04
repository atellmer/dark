/* eslint-disable @typescript-eslint/no-namespace */
export { VERSION } from './constants';
export { renderToString, renderToStream, inject } from './render';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [elemName: string]: any;
    }
  }
}
