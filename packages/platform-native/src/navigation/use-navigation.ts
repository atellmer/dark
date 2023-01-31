import { useNavigationContext } from './navigation-container';
import { useScreenNavigatorContext } from './stack-navigator';

function useNavigation() {
  const { pathname, push, back } = useNavigationContext();
  const { parentPrefix } = useScreenNavigatorContext();

  return {
    match: {
      pathname: parentPrefix,
    },
    pathname,
    navigateTo: push,
    goBack: back,
  };
}

export { useNavigation };
