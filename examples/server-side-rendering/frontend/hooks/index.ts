import { useQuery, useMutation } from '@dark-engine/data';

import { type ProductBrief } from '../../contract';
import { Key, useApi } from '../api';

function useProducts() {
  const api = useApi();

  return useQuery(Key.FETCH_PRODUCTS, () => api.fetchProducts());
}

function useProduct(id: number) {
  const api = useApi();

  return useQuery(Key.FETCH_PRODUCT, ({ id }) => api.fetchProduct(id), {
    variables: { id },
    extractId: x => x.id,
  });
}

function useAddProductMutation() {
  const api = useApi();

  return useMutation(Key.ADD_PRODUCT, api.addProduct, {
    onSuccess: ({ cache, data: product }) => {
      const record = cache.read<Array<ProductBrief>>({ key: Key.FETCH_PRODUCTS });

      if (record) {
        const products = record.data;

        products.push(product);
        cache.optimistic({ key: Key.FETCH_PRODUCTS, data: products });
      }
    },
  });
}

function useChangeProductMutation() {
  const api = useApi();

  return useMutation(Key.CHANGE_PRODUCT, api.changeProduct, {
    onSuccess: ({ cache, data: product }) => {
      const record = cache.read<Array<ProductBrief>>({ key: Key.FETCH_PRODUCTS });

      if (record) {
        const products = record.data;
        const $product = products.find(x => x.id === product.id);

        $product.name = product.name;
        cache.optimistic({ key: Key.FETCH_PRODUCTS, data: products });
        cache.optimistic({ key: Key.FETCH_PRODUCT, data: product, id: product.id });
      }
    },
  });
}

function useRemoveProductMutation() {
  const api = useApi();

  return useMutation(Key.REMOVE_PRODUCT, api.removeProduct, {
    onSuccess: ({ cache, args: [id] }) => {
      const record = cache.read<Array<ProductBrief>>({ key: Key.FETCH_PRODUCTS });

      if (record) {
        const products = record.data;
        const idx = products.findIndex(x => x.id === id);

        if (idx !== -1) {
          products.splice(idx, 1);
          cache.optimistic({ key: Key.FETCH_PRODUCTS, data: products });
        }
      }

      cache.delete({ key: Key.FETCH_PRODUCT, id });
    },
  });
}

export { useProducts, useProduct, useAddProductMutation, useChangeProductMutation, useRemoveProductMutation };
