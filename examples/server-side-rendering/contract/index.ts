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
