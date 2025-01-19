import { __useCursor as useCursor } from '../internal';
import { type Hook, type HookValue } from '../fiber';
import { EFFECT_HOST_MASK } from '../constants';
import { detectIsFiberAlive } from '../walk';
import { detectIsFunction } from '../utils';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

const $$effect = Symbol('effect');

function createEffect(type: EffectType) {
  return (effect: Effect, deps: Array<any> = [{}]) => {
    const $scope = $$scope();
    const cursor = useCursor();
    const scope = useMemo<UseEffectValue>(() => ({ token: $$effect, cleanup: undefined }), []);

    cursor.markHost(EFFECT_HOST_MASK);

    useMemo(() => {
      const run = () => {
        scope.cleanup = effect();

        if (type === EffectType.ASYNC && detectIsFunction(scope.cleanup) && !detectIsFiberAlive(cursor)) {
          scope.cleanup();
        }
      };

      switch (type) {
        case EffectType.INSERTION:
          $scope.addInsertionEffect(run);
          break;
        case EffectType.LAYOUT:
          $scope.addLayoutEffect(run);
          break;
        case EffectType.ASYNC:
          $scope.addAsyncEffect(run);
          break;
        default:
          break;
      }

      detectIsFunction(scope.cleanup) && scope.cleanup();

      return null;
    }, deps);
  };
}

function dropEffects(hook: Hook<HookValue<UseEffectValue>>) {
  for (const { value } of hook.values) {
    value?.token === $$effect && detectIsFunction(value.cleanup) && value.cleanup();
  }
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

const useEffect = createEffect(EffectType.ASYNC);

export { useEffect, dropEffects, createEffect };
