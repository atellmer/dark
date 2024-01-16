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

const IS_SERVER = typeof globalThis.window === 'undefined';
const TIMEOUT = IS_SERVER ? 100 : 600;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// sumulates the database
let nextId = 0;
const products: Array<Product> = new Array(50).fill(null).map(() => ({
  id: ++nextId,
  name: `Product #${nextId}`,
  description:
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum blanditiis quia minus corrupti quidem. Ipsam quae ad velit repudiandae molestias unde'.repeat(
      3,
    ),
}));

// api
const api = {
  async fetchProductList() {
    console.log('[fetch]: product-list');
    await sleep(TIMEOUT);
    const briefs = products.map(x => ({ ...x, description: null })) as Array<ProductBrief>;

    return briefs;
  },
  async fetchProduct(id: number) {
    console.log('[fetch]: product', id);
    if (!detectIsValidId(id)) throwError();
    await sleep(TIMEOUT);
    const product = products.find(x => x.id === id) || null;

    return product;
  },
  async addProduct(product: Partial<Product>) {
    if (detectIsValidId(product.id)) throwError();
    await sleep(TIMEOUT);

    product.id = ++nextId;
    products.push(product as Product);

    return product as Product;
  },
  async changeProduct(product: Product) {
    if (!detectIsValidId(product.id)) throwError();
    if (!product) return null;
    await sleep(TIMEOUT);
    const idx = products.findIndex(x => x.id === product.id);

    if (idx !== -1) {
      products.splice(idx, 1, product);
    }

    return product;
  },
  async removeProduct(id: number) {
    if (!detectIsValidId(id)) throwError();
    await sleep(TIMEOUT);
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
