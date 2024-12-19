import { detectIsFunction, illegal } from '../utils';
import { __useLoc as useLoc } from '../internal';
import { type Callback } from '../shared';
import { scheduler } from '../scheduler';
import { useState } from '../use-state';
import { useEvent } from '../use-event';
import { $$scope } from '../scope';

function startTransition(callback: Callback) {
  const $scope = $$scope();
  const id = scheduler.getLastId();

  $scope.setIsTransitionZone(true);
  try {
    callback();
    if (id === scheduler.getLastId()) {
      const fn = $scope.getOnTransitionEnd();

      detectIsFunction(fn) && fn(() => false);
      illegal('startTransition must plan a new render!');
    }
  } finally {
    $scope.setIsTransitionZone(false);
  }
}

function useTransition(): [boolean, typeof startTransition] {
  const [isPending, setIsPending] = useState(false);
  const loc = useLoc();
  const $scope = $$scope();
  const $startTransition = useEvent((callback: Callback) => {
    setIsPending(true);
    $scope.setOnTransitionEnd(fn => setIsPending(fn(loc())));
    startTransition(callback);
    $scope.setOnTransitionEnd(null);
  });
  const $isPending = scheduler.detectIsTransition() ? false : isPending;

  return [$isPending, $startTransition];
}

export { startTransition, useTransition };
