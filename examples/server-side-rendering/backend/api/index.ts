import { type Express, type Request, type Response, type NextFunction } from 'express';
import { type Api, type ProductBrief, type Product } from '../../contract';

// sumulates the database
const TIMEOUT = 300;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let nextId = 0;
const products: Array<Product> = new Array(50).fill(null).map(() => ({
  id: ++nextId,
  name: `Product #${nextId}`,
  description:
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum blanditiis quia minus corrupti quidem. Ipsam quae ad velit repudiandae molestias unde'.repeat(
      3,
    ),
}));

const api: Api = {
  marker: 'backend',
  async fetchProducts() {
    await sleep(TIMEOUT);
    const briefs = products.map(x => ({ ...x, description: null })) as Array<ProductBrief>;

    return briefs;
  },
  async addProduct(product: Partial<Product>) {
    await sleep(TIMEOUT);

    product.id = ++nextId;
    products.push(product as Product);

    return product as Product;
  },
  async fetchProduct(id: number) {
    checkId(id);
    await sleep(TIMEOUT);
    const product = products.find(x => x.id === id) || null;

    return product;
  },
  async changeProduct(id: number, product: Partial<Product>) {
    checkId(id);
    if (!product) return null;
    await sleep(TIMEOUT);
    const idx = products.findIndex(x => x.id === id);

    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product };
    }

    return products[idx] || null;
  },
  async removeProduct(id: number) {
    checkId(id);
    await sleep(TIMEOUT);
    const idx = products.findIndex(x => x.id === id);

    if (idx !== -1) {
      products.splice(idx, 1);
    }

    return true;
  },
};

function checkId(id: unknown) {
  const isValid = typeof id === 'number' && !Number.isNaN(id);

  if (!isValid) {
    throw new Error('Invalid id!');
  }
}

function createRestApi(app: Express) {
  app.get('/api/products', async (_, res, next) => {
    try {
      res.json(await api.fetchProducts());
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/products', async (req, res, next) => {
    try {
      const data = await api.addProduct(req.body);

      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/products/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await api.fetchProduct(id);

      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/products/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await api.changeProduct(id, req.body);

      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/products/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      res.json(await api.removeProduct(id));
    } catch (error) {
      next(error);
    }
  });

  app.use((err: any, _: Request, res: Response, next: NextFunction) => {
    res.status(500).send('Server error!');
    next(err);
  });
}

export { api, createRestApi };
