import { useQuery, useMutation, useApi as $useApi } from '@dark-engine/data';

import { type Api, type ProductBrief, Key } from '../../contract';

const useApi = () => $useApi<Api>();

function useProducts() {
  const api = useApi();

  return useQuery(Key.FETCH_PRODUCTS, () => api.fetchProducts(), { strategy: 'hybrid' });
}

function useProduct(id: number) {
  const api = useApi();

  return useQuery(Key.FETCH_PRODUCT, ({ id }) => api.fetchProduct(id), {
    strategy: 'hybrid',
    variables: { id },
    extractId: x => x.id,
  });
}

function useAddProductMutation() {
  const api = useApi();

  return useMutation(Key.ADD_PRODUCT, api.addProduct, {
    strategy: 'state-only',
    onSuccess: ({ cache, data: product }) => {
      const record = cache.read<Array<ProductBrief>>(Key.FETCH_PRODUCTS);

      if (record) {
        const products = record.data;

        products.push(product);
        cache.optimistic(Key.FETCH_PRODUCTS, products);
      }
    },
  });
}

function useChangeProductMutation() {
  const api = useApi();

  return useMutation(Key.CHANGE_PRODUCT, api.changeProduct, {
    strategy: 'state-only',
    onSuccess: ({ cache, data: product }) => {
      const record = cache.read<Array<ProductBrief>>(Key.FETCH_PRODUCTS);

      if (record) {
        const products = record.data;
        const $product = products.find(x => x.id === product.id);

        $product.name = product.name;
        cache.optimistic(Key.FETCH_PRODUCTS, products);
        cache.optimistic(Key.FETCH_PRODUCT, product, { id: product.id });
      }
    },
  });
}

function useRemoveProductMutation() {
  const api = useApi();

  return useMutation(Key.REMOVE_PRODUCT, api.removeProduct, {
    strategy: 'state-only',
    onSuccess: ({ cache, args: [id] }) => {
      const record = cache.read<Array<ProductBrief>>(Key.FETCH_PRODUCTS);

      if (record) {
        const products = record.data;
        const idx = products.findIndex(x => x.id === id);

        if (idx !== -1) {
          products.splice(idx, 1);
          cache.optimistic(Key.FETCH_PRODUCTS, products);
        }
      }

      cache.delete(Key.FETCH_PRODUCT, { id });
    },
  });
}

export { useApi, useProducts, useProduct, useAddProductMutation, useChangeProductMutation, useRemoveProductMutation };
