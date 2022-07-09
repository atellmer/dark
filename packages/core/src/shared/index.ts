import { detectIsUndefined } from '@dark/core/helpers';

function detectIsDepsDifferent(deps: Array<unknown>, prevDeps: Array<unknown>): boolean {
  if (!detectIsUndefined(deps) && !detectIsUndefined(prevDeps) && deps.length > 0 && prevDeps.length > 0) {
    for (let i = 0; i < prevDeps.length; i++) {
      if (prevDeps[i] !== deps[i]) {
        return true;
      }
    }
  }

  return false;
}

export * from './model';
export { detectIsDepsDifferent };
