import { type Callback } from '../shared';
import { scheduler } from '../scheduler';
import { useState } from '../use-state';
import { useEvent } from '../use-event';
import { $$scope } from '../scope';

function startTransition(callback: Callback) {
  const $scope = $$scope();

  $scope.setIsTransitionZone(true);
  callback();
  $scope.setIsTransitionZone(false);
}

function useTransition(): [boolean, typeof startTransition] {
  const [isPending, setIsPending] = useState(false);
  const $scope = $$scope();
  const $startTransition = useEvent((callback: Callback) => {
    setIsPending(true);
    $scope.setOnTransitionEnd(() => setIsPending(false));
    startTransition(callback);
    $scope.setOnTransitionEnd(null);
  });
  const $isPending = scheduler.detectIsTransition() ? false : isPending;

  return [$isPending, $startTransition];
}

export { startTransition, useTransition };
