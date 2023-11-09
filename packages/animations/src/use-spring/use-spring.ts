import { type ItemOptions, type SpringsApi, useSprings } from '../use-springs';
import { type SpringItem } from '../shared';

function useSpring<T extends string>(options: ItemOptions<T>): [SpringItem<T>, SpringsApi<T>] {
  const [items, api] = useSprings(1, () => options);

  return [items[0], api];
}

export { useSpring };
