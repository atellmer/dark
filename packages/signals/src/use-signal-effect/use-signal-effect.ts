import { Callback, useEffect } from '@dark-engine/core';

import { effect } from '../effect';

function useSignalEffect(fn: Callback) {
  useEffect(() => effect(fn), []);
}

export { useSignalEffect };
