import useListTransitions, { GetKey, TransitionOptions } from './use-list-transitions';
import useAtomicTransitions from './use-atomic-transitions';
import { isArray, error } from '@helpers';
import { DARK } from '@core/constants';


function useTransitions<T = boolean>(items: T | Array<T>, getKey: GetKey<T> | null, transitionOptions: TransitionOptions) {
  return isArray(items)
    ? useListTransitions(items, getKey, transitionOptions)
    : typeof items === 'boolean'
      ? useAtomicTransitions(items, transitionOptions)
      : error(`[${DARK}]: useStransitions must take only array or boolean argument as items!`)
}

export default useTransitions;
