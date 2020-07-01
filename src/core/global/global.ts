import { Platform } from './model';


export const platform: Platform = {
  raf: () => {
    throw new Error('raf doesn\'t install by renderer');
  },
  ric:  () => {
    throw new Error('ric doesn\'t install by renderer');
  },
  createLink: () => {
    throw new Error('createLink doesn\'t install by renderer');
  },
  applyCommits: () => {
    throw new Error('applyCommits doesn\'t install by renderer');
  },
};
