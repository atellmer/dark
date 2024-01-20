import { type UseQueryOptions, type Query, type Variables, type QueryResult, useQuery } from '../use-query';

type UseLazyQueryOptions<T, V extends Variables> = Omit<UseQueryOptions<T, V>, 'lazy'>;

function useLazyQuery<T, V extends Variables>(key: string, query: Query<T, V>, options: UseLazyQueryOptions<T, V>) {
  const { refetch, ...rest } = useQuery(key, query, { ...options, lazy: true });

  return [refetch, rest] as [Query<T, V>, LazyQueryResult<T>];
}

type LazyQueryResult<T> = Omit<QueryResult<T>, 'refetch'>;

export { useLazyQuery };
