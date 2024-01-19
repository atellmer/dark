import { type UseQueryOptions, type Query, type Variables, type QueryResult, useQuery } from '../use-query';

type UseLazyQueryOptions<V extends Variables> = Omit<UseQueryOptions<V>, 'lazy'>;

function useLazyQuery<T, V extends Variables>(query: Query<T, V>, options: UseLazyQueryOptions<V>) {
  const { refetch, ...rest } = useQuery(query, { ...options, lazy: true });

  return [refetch, rest] as [Query<T, V>, LazyQueryResult<T>];
}

type LazyQueryResult<T> = Omit<QueryResult<T>, 'refetch'>;

export { useLazyQuery };
