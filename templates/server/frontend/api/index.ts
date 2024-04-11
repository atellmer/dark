import { type Api, type Product } from '../../contract';

const api: Api = {
  async fetchProducts() {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error(`${response.status}`);
    const data = (await response.json()) as Array<Product>;

    return data;
  },
};

export { api };
