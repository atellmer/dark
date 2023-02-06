import { useMemo } from '@dark-engine/core';

import { type ParamsMap } from '../history';
import { useNavigationContext, type Push, type Back } from '../navigation-container';
import { useScreenNavigatorContext } from '../stack-navigator';

type Navigation = {
  match: {
    pathname: string;
  };
  pathname: string;
  params: ParamsMap;
  navigateTo: Push;
  goBack: Back;
};

function useNavigation(): Navigation {
  const { pathname, push, back, getParams, transition } = useNavigationContext();
  const { prefix, parentPrefix, initialParams } = useScreenNavigatorContext();
  const defaultParams = new Map(Object.entries(initialParams));
  const scope = useMemo(() => ({ params: defaultParams }), []);
  const params = getParams(prefix) || (transition ? scope.params : defaultParams);
  const value: Navigation = {
    match: {
      pathname: parentPrefix,
    },
    pathname,
    params,
    navigateTo: push,
    goBack: back,
  };

  scope.params = params;

  return value;
}

export { useNavigation };
