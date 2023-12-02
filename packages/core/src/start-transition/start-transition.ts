import { $$scope } from '../scope';
import { useState } from '../use-state';
import { type Callback } from '../shared';
import { useEvent } from '../use-event';

export type SetPendingStatus = (value: boolean) => void;

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
    $scope.setPendingStatusSetter(setIsPending);
    startTransition(callback);
    $scope.setPendingStatusSetter(null);
  });

  return [isPending, $startTransition];
}

export { startTransition, useTransition };
