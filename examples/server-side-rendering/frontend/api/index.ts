import { useApi as $useApi } from '@dark-engine/data';

import { type Api, type ProductBrief, type Product } from '../../contract';
import { detectIsBrowser, getItem, setItem, checkId, checkResponse, headers } from '../utils';

export enum Key {
  FETCH_PRODUCTS = 'FETCH_PRODUCTS',
  FETCH_PRODUCT = 'FETCH_PRODUCT',
  ADD_PRODUCT = 'ADD_PRODUCT',
  CHANGE_PRODUCT = 'CHANGE_PRODUCT',
  REMOVE_PRODUCT = 'REMOVE_PRODUCT',
}

const api: Api = {
  marker: 'frontend',
  async fetchProducts() {
    let data: Array<ProductBrief> = null;

    try {
      const response = await fetch('/api/products');

      checkResponse(response);
      data = (await response.json()) as Array<ProductBrief>;
    } catch (error) {
      data = getItem(Key.FETCH_PRODUCTS, String(error));
    }

    return data;
  },
  async addProduct(product: Partial<Product>, fromSync = false) {
    let data: Product = null;

    try {
      const response = await fetch(`/api/products`, {
        method: 'post',
        headers: headers(),
        body: JSON.stringify({ ...product, id: undefined }),
      });
      checkResponse(response);
      data = (await response.json()) as Product;
    } catch (error) {
      if (fromSync) {
        throw new Error('Sync!');
      }

      data = { ...product, id: Math.random() } as Product;
      const queue: Array<Partial<Product>> = getItem(Key.ADD_PRODUCT) || [];

      queue.push(product);
      setItem(Key.ADD_PRODUCT, queue);
    }

    return data;
  },
  async fetchProduct(id: number) {
    checkId(id);
    const response = await fetch(`/api/products/${id}`);
    checkResponse(response);
    const data = (await response.json()) as Product;

    return data;
  },
  async changeProduct(id: number, product: Partial<Product>) {
    checkId(id);
    if (!product) return null;
    const response = await fetch(`/api/products/${id}`, {
      method: 'put',
      headers: headers(),
      body: JSON.stringify(product),
    });
    checkResponse(response);
    const data = (await response.json()) as Product;

    return data;
  },
  async removeProduct(id: number) {
    checkId(id);
    const response = await fetch(`/api/products/${id}`, { method: 'delete' });
    checkResponse(response);
    const data = (await response.json()) as boolean;

    return data;
  },
};

function sync() {
  let inProcess = false;
  const make = async () => {
    if (inProcess) return;
    inProcess = true;
    const queue: Array<Partial<Product>> = getItem(Key.ADD_PRODUCT) || [];

    try {
      await Promise.all(queue.map(x => api.addProduct(x, true)));
      setItem(Key.ADD_PRODUCT, []);
    } catch (error) {
      //
    } finally {
      inProcess = false;
    }
  };

  window.addEventListener('load', make);
  window.addEventListener('online', make);
}

if (detectIsBrowser()) {
  sync();
}

const useApi = () => $useApi() as Api;

export { api, useApi };
