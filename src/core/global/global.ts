import {  Global } from './model';

export const global: Global = {
  raf: () => {
    throw new Error('raf doesn\'t install by renderer');
  },
  ric:  () => {
    throw new Error('ric doesn\'t install by renderer');
  },
};
