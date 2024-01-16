import { useResource, useMutation } from '@dark-engine/core';

import { type ProductBrief, Cache, api } from '../api';

function useProducts() {
  return useResource(() => api.fetchProducts(), {
    key: Cache.PRODUCTS,
    onBefore: () => console.log('[fetch]: products'),
  });
}

function useProduct(id: number) {
  return useResource(({ id }) => api.fetchProduct(id), {
    variables: { id },
    key: Cache.PRODUCT_ITEM,
    extractId: x => x.id,
    onBefore: () => {
      console.log('[fetch]: product', id);
    },
  });
}

function useAddProductMutation() {
  return useMutation(api.addProduct, {
    onSuccess: (cache, product) => {
      const record = cache.read<Array<ProductBrief>>({ key: Cache.PRODUCTS });

      if (record) {
        const products = record.data;

        products.push(product);
        cache.optimistic({ key: Cache.PRODUCTS, data: products });
      }
    },
  });
}

function useChangeProductMutation() {
  return useMutation(api.changeProduct, {
    onSuccess: (cache, product) => {
      const record = cache.read<Array<ProductBrief>>({ key: Cache.PRODUCTS });

      if (record) {
        const products = record.data;
        const $product = products.find(x => x.id === product.id);

        $product.name = product.name;
        cache.optimistic({ key: Cache.PRODUCTS, data: products });
        cache.optimistic({ key: Cache.PRODUCT_ITEM, data: product, id: product.id });
      }
    },
  });
}

function useRemoveProductMutation(id: number) {
  return useMutation(() => api.removeProduct(id), {
    onSuccess: cache => {
      const record = cache.read<Array<ProductBrief>>({ key: Cache.PRODUCTS });

      if (record) {
        const products = record.data;
        const idx = products.findIndex(x => x.id === id);

        if (idx !== -1) {
          products.splice(idx, 1);
          cache.optimistic({ key: Cache.PRODUCTS, data: products });
        }
      }

      cache.delete({ key: Cache.PRODUCT_ITEM, id });
    },
  });
}

export { useProducts, useProduct, useAddProductMutation, useChangeProductMutation, useRemoveProductMutation };
