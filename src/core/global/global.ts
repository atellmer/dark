import { Platform } from './model';


export const platform: Platform = {
  raf: () => {
    throw new Error('raf doesn\'t install by renderer');
  },
  ric:  () => {
    throw new Error('ric doesn\'t install by renderer');
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
};
