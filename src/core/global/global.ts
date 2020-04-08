import { Global } from './model';


export const global: Global = {
  raf: () => {
    throw new Error('raf doesn\'t install by renderer');
  },
  ric:  () => {
    throw new Error('ric doesn\'t install by renderer');
  },
  createLink: () => {
    throw new Error('createLink doesn\'t install by renderer');
  },
  updateTree: () => {
    throw new Error('updateTree doesn\'t install by renderer');
  },
};
