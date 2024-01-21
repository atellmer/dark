import { useQuery } from '@dark-engine/data';

import { Key, useApi } from '../api';

function useProducts() {
  const api = useApi();

  return useQuery(Key.PRODUCTS, () => api.fetchProducts());
}

export { useProducts };
