export type ProductBrief = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
};

export type Api = {
  marker: string;
  fetchProducts: () => Promise<Array<ProductBrief>>;
  addProduct: (product: Partial<Product>, fromSync?: boolean) => Promise<Product>;
  fetchProduct: (id: number) => Promise<Product>;
  changeProduct: (id: number, product: Partial<Product>) => Promise<Product>;
  removeProduct: (id: number) => Promise<boolean>;
};

export enum Key {
  FETCH_PRODUCTS = 'FETCH_PRODUCTS',
  FETCH_PRODUCT = 'FETCH_PRODUCT',
  ADD_PRODUCT = 'ADD_PRODUCT',
  CHANGE_PRODUCT = 'CHANGE_PRODUCT',
  REMOVE_PRODUCT = 'REMOVE_PRODUCT',
}
