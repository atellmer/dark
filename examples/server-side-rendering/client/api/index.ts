type ProductBrief = {
  id: number;
  title: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PRODUCTS_KEY = 'products';
const PRODUCT_KEY = 'product';
const cache: Record<string, any> = {
  [PRODUCTS_KEY]: null,
  [PRODUCT_KEY]: {},
};
const isServer = typeof globalThis.process !== 'undefined';

const api = {
  async fetchProductList() {
    if (isServer || !cache[PRODUCTS_KEY]) {
      await sleep(isServer ? 100 : 600);
      const products: Array<ProductBrief> = new Array(10)
        .fill(null)
        .map((_, idx) => ({ id: idx + 1, title: `Product #${idx + 1}` }));

      cache[PRODUCTS_KEY] = products;
    }

    return cache[PRODUCTS_KEY] as Array<ProductBrief>;
  },
  async fetchProduct(id: number) {
    if (isServer || !cache[PRODUCT_KEY][id]) {
      await sleep(isServer ? 100 : 600);
      if (typeof id !== 'number' || Number.isNaN(id)) throw new Error('Invalid id!');
      const product: Product = {
        id,
        title: `Product #${id}`,
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum blanditiis quia minus corrupti quidem. Ipsam quae ad velit repudiandae molestias unde ab officiis harum atque? Quo veritatis maxime illo asperiores.',
      };

      cache[PRODUCT_KEY][id] = product;
    }

    return cache[PRODUCT_KEY][id] as Product;
  },
};

export { api };
