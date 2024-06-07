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
    const scope = useMemo<Scope>(() => ({ token: $$effect, cleanup: undefined }), []);
    const isInsertionEffect = type === EffectType.INSERTION;
    const isLayoutEffect = type === EffectType.LAYOUT;
    const isAsyncEffect = type === EffectType.ASYNC;

    cursor.markHost(EFFECT_HOST_MASK);

    useMemo(() => {
      const runEffect = () => {
        scope.cleanup = effect();

        if (isAsyncEffect && detectIsFunction(scope.cleanup) && !detectIsFiberAlive(cursor)) {
          scope.cleanup();
        }
      };

      isAsyncEffect && $scope.addEffect1(runEffect);
      isLayoutEffect && $scope.addEffect2(runEffect);
      isInsertionEffect && $scope.addEffect3(runEffect);
      detectIsFunction(scope.cleanup) && scope.cleanup();
    }, deps);
  };
}

export type Scope = {
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

function dropEffects(hook: Hook<HookValue<Scope>>) {
  for (const { value: effect } of hook.values) {
    effect?.token === $$effect && detectIsFunction(effect.cleanup) && effect.cleanup();
  }
}

const useEffect = createEffect(EffectType.ASYNC);

export { useEffect, dropEffects, createEffect };
