import { useApi as $useApi } from '@dark-engine/data';

import { type Api, type Product } from '../../contract';

export enum Key {
  PRODUCTS = 'PRODUCTS',
}

const api: Api = {
  async fetchProducts() {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error(`${response.status}`);
    const data = (await response.json()) as Array<Product>;

    return data;
  },
};

const useApi = () => $useApi<Api>();

export { api, useApi };
