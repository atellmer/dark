import { type InMemoryCache } from '@dark-engine/core';

export type ProductBrief = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
};

export enum State {
  PRODUCTS = 'products',
  PRODUCT_ITEM = 'product-item',
}

const APP_CACHE = 'APP_CACHE';
const IS_SERVER = typeof globalThis.window === 'undefined';
const TIMEOUT = IS_SERVER ? 100 : 600;
const DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum blanditiis quia minus corrupti quidem. Ipsam quae ad velit repudiandae molestias unde'.repeat(
    3,
  );

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// sumulates the database
let nextId = 0;
const state = IS_SERVER ? null : JSON.parse(localStorage.getItem(APP_CACHE));
let products: Array<Product> = [];

if (state) {
  products = [...state[State.PRODUCTS]['__ROOT__'].data];
  products.forEach(x => {
    x.description = DESCRIPTION;
  });
  nextId = Math.max(...products.map(x => x.id));
} else {
  products = new Array(50).fill(null).map(() => ({
    id: ++nextId,
    name: `Product #${nextId}`,
    description: DESCRIPTION,
  }));
}

// api
const api = {
  restore() {
    if (IS_SERVER) return;
    let state = undefined;

    try {
      state = JSON.parse(localStorage.getItem(APP_CACHE));
    } catch (error) {
      console.error(error);
    }

    return state;
  },
  persist(cache: InMemoryCache) {
    if (IS_SERVER) return;
    localStorage.setItem(APP_CACHE, JSON.stringify(cache.get()));
  },
  async fetchProductList() {
    await sleep(TIMEOUT);
    const briefs = products.map(x => ({ ...x, description: null })) as Array<ProductBrief>;

    return briefs;
  },
  async fetchProduct(id: number) {
    await sleep(TIMEOUT);
    if (!detectIsValidId(id)) throwError();
    const product = products.find(x => x.id === id) || null;

    return product;
  },
  async addProduct(product: Partial<Product>) {
    await sleep(TIMEOUT);
    if (detectIsValidId(product.id)) throwError();

    product.id = ++nextId;
    products.push(product as Product);

    return product as Product;
  },
  async changeProduct(product: Product) {
    await sleep(TIMEOUT);
    if (!product) return null;
    if (!detectIsValidId(product.id)) throwError();
    const idx = products.findIndex(x => x.id === product.id);

    if (idx !== -1) {
      products.splice(idx, 1, product);
    }

    return product;
  },
  async removeProduct(id: number) {
    await sleep(TIMEOUT);
    if (!detectIsValidId(id)) throwError();
    const idx = products.findIndex(x => x.id === id);

    if (idx !== -1) {
      products.splice(idx, 1);
    }

    return true;
  },
};

const detectIsValidId = (id: unknown) => typeof id === 'number' && !Number.isNaN(id);

const throwError = () => {
  throw new Error('Invalid id!');
};

export { api };
