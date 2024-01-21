import { type Express } from 'express';
import { type Api, type Product } from '../../contract';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let nextId = 0;
const products: Array<Product> = new Array(50).fill(null).map(() => ({
  id: ++nextId,
  name: `Product #${nextId}`,
}));

const api: Api = {
  async fetchProducts() {
    await sleep(300);

    return products;
  },
};

function createRestApi(app: Express) {
  app.get('/api/products', async (_, res) => {
    res.json(await api.fetchProducts());
  });
}

export { api, createRestApi };
