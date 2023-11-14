import { type SpringItemConfig, type SpringApi, useSprings } from '../use-springs';
import { type SpringItem } from '../shared';

function useSpring<T extends string>(options: SpringItemConfig<T>): [SpringItem<T>, SpringApi<T>] {
  const [items, api] = useSprings(1, () => options);

  return [items[0], api];
}

export { useSpring };
