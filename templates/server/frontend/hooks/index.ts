import { useQuery, useApi as $useApi } from '@dark-engine/data';

import { type Api, Key } from '../../contract';

const useApi = () => $useApi<Api>();

function useProducts() {
  const api = useApi();

  return useQuery(Key.PRODUCTS, () => api.fetchProducts());
}

export { useApi, useProducts };
