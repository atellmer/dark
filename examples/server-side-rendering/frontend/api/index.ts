import { type Api, type ProductBrief, type Product } from '../../contract';

const HEADERS = { 'Content-Type': 'application/json' };
const api: Api = {
  marker: 'frontend',
  async fetchProducts() {
    const response = await fetch('/api/products');
    checkResponse(response);
    const data = (await response.json()) as Array<ProductBrief>;

    return data;
  },
  async addProduct(product: Partial<Product>) {
    const response = await fetch(`/api/products`, {
      method: 'post',
      headers: HEADERS,
      body: JSON.stringify({ ...product, id: undefined }),
    });
    checkResponse(response);
    const data = (await response.json()) as Product;

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
      headers: HEADERS,
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

function checkId(id: unknown) {
  const isValid = typeof id === 'number' && !Number.isNaN(id);

  if (!isValid) {
    throw new Error('Invalid id!');
  }
}

function checkResponse(response: Response) {
  if (!response.ok) throw new Error(`${response.status}`);
}

export { api };
