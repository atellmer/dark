import { type SpringItemConfig, type SpringApi, useSprings } from '../use-springs';
import { type Spring } from '../spring';

function useSpring<T extends string>(options: SpringItemConfig<T>, deps?: Array<any>): [Spring<T>, SpringApi<T>] {
  const [items, api] = useSprings(1, () => options, deps);

  return [items[0], api];
}

export { useSpring };
