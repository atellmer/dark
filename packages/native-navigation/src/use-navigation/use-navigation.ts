import { type Params } from '../history';
import { useNavigationContext, type Push, type Back } from '../navigation-container';
import { useScreenNavigatorContext } from '../stack-navigator';

type Navigation = {
  match: {
    pathname: string;
  };
  pathname: string;
  params: Params;
  navigateTo: Push;
  goBack: Back;
};

function useNavigation(): Navigation {
  const { pathname, push, back, getParams } = useNavigationContext();
  const { prefix, parentPrefix, initialParams } = useScreenNavigatorContext();
  const params = getParams(prefix) || initialParams;
  const value: Navigation = {
    match: {
      pathname: parentPrefix,
    },
    pathname,
    params,
    navigateTo: push,
    goBack: back,
  };

  return value;
}

export { useNavigation };
