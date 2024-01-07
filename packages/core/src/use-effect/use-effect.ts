import { detectIsFunction } from '../utils';
import { INSERTION_EFFECT_HOST_MASK, LAYOUT_EFFECT_HOST_MASK, ASYNC_EFFECT_HOST_MASK } from '../constants';
import { $$scope } from '../scope';
import { useMemo } from '../use-memo';
import { type Hook, type HookValue } from '../fiber';

const $$useEffect = Symbol('use-effect');

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

    isInsertionEffect && fiber.markHost(INSERTION_EFFECT_HOST_MASK);
    isLayoutEffect && fiber.markHost(LAYOUT_EFFECT_HOST_MASK);
    isAsyncEffect && fiber.markHost(ASYNC_EFFECT_HOST_MASK);

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

export type DropEffect = void | (() => void);

export type Effect = () => DropEffect;

export enum EffectType {
  ASYNC = 'ASYNC',
  LAYOUT = 'LAYOUT',
  INSERTION = 'INSERTION',
}

const { useEffect, dropEffects } = createEffect($$useEffect, EffectType.ASYNC);

export { useEffect, dropEffects, createEffect };
