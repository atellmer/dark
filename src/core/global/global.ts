import { Platform } from './model';


export const platform: Platform = {
  raf: () => {
    throw new Error('raf doesn\'t install by renderer');
  },
  requestCallback:  () => {
    throw new Error('requestCallback doesn\'t install by renderer');
  },
  shouldYeildToHost: () => {
    throw new Error('shouldYeildToHost doesn\'t install by renderer');
  },
  createNativeElement: () => {
    throw new Error('createNativeElement doesn\'t install by renderer');
  },
  applyCommits: () => {
    throw new Error('applyCommits doesn\'t install by renderer');
  },
  detectIsPortal: () => {
    throw new Error('detectIsPortal doesn\'t install by renderer');
  },
  unmountPortal: () => {
    throw new Error('unmountPortal doesn\'t install by renderer');
  },
};
