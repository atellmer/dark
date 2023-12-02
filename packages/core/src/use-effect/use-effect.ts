import { detectIsFunction } from '../helpers';
import { MASK_INSERTION_EFFECT_HOST, MASK_LAYOUT_EFFECT_HOST, MASK_ASYNC_EFFECT_HOST } from '../constants';
import { $$scope } from '../scope';
import { useMemo } from '../use-memo';
import { type Hook, type HookValue } from '../fiber';
import { type Effect, type DropEffect, EffectType } from './types';

const $$useEffect = Symbol('use-effect');
const { useEffect, dropEffects } = createEffect($$useEffect, EffectType.ASYNC);

type UseEffectValue = {
  token: Symbol;
  cleanup: DropEffect;
};

function createEffect(token: Symbol, type: EffectType) {
  function useEffect(effect: Effect, deps: Array<any> = [{}]) {
    const $scope = $$scope();
    const fiber = $scope.getCursorFiber();
    const scope = useMemo<UseEffectValue>(() => ({ token, cleanup: undefined }), []);
    const isInsertionEffect = type === EffectType.INSERTION;
    const isLayoutEffect = type === EffectType.LAYOUT;
    const isAsyncEffect = type === EffectType.ASYNC;

    isInsertionEffect && fiber.markHost(MASK_INSERTION_EFFECT_HOST);
    isLayoutEffect && fiber.markHost(MASK_LAYOUT_EFFECT_HOST);
    isAsyncEffect && fiber.markHost(MASK_ASYNC_EFFECT_HOST);

    useMemo(() => {
      const runEffect = () => (scope.cleanup = effect());

      isInsertionEffect && $scope.addInsertionEffect(runEffect);
      isLayoutEffect && $scope.addLayoutEffect(runEffect);
      isAsyncEffect && $scope.addAsyncEffect(runEffect);

      detectIsFunction(scope.cleanup) && scope.cleanup();

      return null;
    }, deps);
  }

  function dropEffects(hook: Hook<HookValue<UseEffectValue>>) {
    for (const { value: effect } of hook.values) {
      effect && effect.token === token && detectIsFunction(effect.cleanup) && effect.cleanup();
    }
  }

  return {
    useEffect,
    dropEffects,
  };
}

export { useEffect, dropEffects, createEffect };
