import { type DarkElement, component, createContext, useContext } from '@dark-engine/core';

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
  addProduct: (product: Partial<Product>) => Promise<Product>;
  fetchProduct: (id: number) => Promise<Product>;
  changeProduct: (id: number, product: Partial<Product>) => Promise<Product>;
  removeProduct: (id: number) => Promise<boolean>;
};

const ApiContext = createContext<Api>(null, { displayName: 'Api' });

const useApi = () => useContext(ApiContext);

type ApiProviderProps = {
  api: Api;
  slot: DarkElement;
};

const ApiProvider = component<ApiProviderProps>(({ api, slot }) => {
  return ApiContext.Provider({ value: api, slot });
});

export { useApi, ApiProvider };
