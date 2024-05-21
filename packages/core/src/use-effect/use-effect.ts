import { INSERTION_EFFECT_HOST_MASK, LAYOUT_EFFECT_HOST_MASK, ASYNC_EFFECT_HOST_MASK } from '../constants';
import { __useCursor as useCursor } from '../internal';
import { type Hook, type HookValue } from '../fiber';
import { detectIsFiberAlive } from '../walk';
import { detectIsFunction } from '../utils';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

const $$useEffect = Symbol('use-effect');

function createEffect(token: Symbol, type: EffectType) {
  function useEffect(effect: Effect, deps: Array<any> = [{}]) {
    const $scope = $$scope();
    const cursor = useCursor();
    const scope = useMemo<UseEffectValue>(() => ({ token, cleanup: undefined }), []);
    const isInsertionEffect = type === EffectType.INSERTION;
    const isLayoutEffect = type === EffectType.LAYOUT;
    const isAsyncEffect = type === EffectType.ASYNC;

    isInsertionEffect && cursor.markHost(INSERTION_EFFECT_HOST_MASK);
    isLayoutEffect && cursor.markHost(LAYOUT_EFFECT_HOST_MASK);
    isAsyncEffect && cursor.markHost(ASYNC_EFFECT_HOST_MASK);

    useMemo(() => {
      const runEffect = () => {
        scope.cleanup = effect();

        if (isAsyncEffect && detectIsFunction(scope.cleanup) && !detectIsFiberAlive(cursor)) {
          scope.cleanup();
        }
      };

      isInsertionEffect && $scope.addEffect3(runEffect);
      isLayoutEffect && $scope.addEffect2(runEffect);
      isAsyncEffect && $scope.addEffect1(runEffect);

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

export type UseEffectValue = {
  token: Symbol;
  cleanup: DropEffect;
};

export type DropEffect = void | (() => void);

export type Effect = () => DropEffect;

export enum EffectType {
  ASYNC = 'ASYNC',
  LAYOUT = 'LAYOUT',
  INSERTION = 'INSERTION',
}

const { useEffect, dropEffects } = createEffect($$useEffect, EffectType.ASYNC);

export { useEffect, dropEffects, createEffect };
