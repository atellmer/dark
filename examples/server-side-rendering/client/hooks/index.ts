import { useQuery, useMutation } from '@dark-engine/core';

import { type ProductBrief, api } from '../api';

export enum Key {
  FETCH_PRODUCTS = 'FETCH_PRODUCTS',
  FETCH_PRODUCT = 'FETCH_PRODUCT',
  ADD_PRODUCT = 'ADD_PRODUCT',
  CHANGE_PRODUCT = 'CHANGE_PRODUCT',
  REMOVE_PRODUCT = 'REMOVE_PRODUCT',
}

function useProducts() {
  return useQuery(() => api.fetchProducts(), { key: Key.FETCH_PRODUCTS });
}

function useProduct(id: number) {
  return useQuery(({ id }) => api.fetchProduct(id), {
    key: Key.FETCH_PRODUCT,
    variables: { id },
    extractId: x => x.id,
  });
}

function useAddProductMutation() {
  return useMutation(api.addProduct, {
    key: Key.ADD_PRODUCT,
    onSuccess: (cache, product) => {
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
  return useMutation(api.changeProduct, {
    key: Key.CHANGE_PRODUCT,
    onSuccess: (cache, product) => {
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

function useRemoveProductMutation(id: number) {
  return useMutation(() => api.removeProduct(id), {
    key: Key.REMOVE_PRODUCT,
    onSuccess: cache => {
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
