import { Callback, useEffect } from '@dark-engine/core';

import { effect } from '../effect';
import { setContext } from '../context';

function useSignalEffect(fn: Callback) {
  setContext(null);
  useEffect(() => effect(fn), []);
}

export { useSignalEffect };
