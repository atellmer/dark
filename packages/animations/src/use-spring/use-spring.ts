import { type ItemConfig, type SpringsApi, useSprings } from '../use-springs';
import { type SpringValue } from '../shared';

function useSpring<T extends string>(config: ItemConfig<T>, deps: Array<any> = []): [SpringValue<T>, SpringsApi<T>] {
  const [springs, api] = useSprings(1, () => config, deps);

  return [springs[0], api];
}

export { useSpring };
