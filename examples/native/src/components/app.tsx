import { CoreTypes } from '@nativescript/core';
import { h, Fragment, createComponent } from '@dark-engine/core';
import {
  NavigationContainer,
  useNavigation,
  StackNavigator,
  TabNavigator,
  NavigationTransitionName,
  type NavigationOptions,
} from '@dark-engine/platform-native';

const Home = createComponent(() => {
  const { navigateTo: navigateTo$, goBack, match } = useNavigation();
  const navigateTo = useAnimatedNavigation(navigateTo$);

  return (
    <stack-layout backgroundColor='#26c6da' height='100%'>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Contacts`)}>
        go to contacts
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Settings`)}>
        go to settings
      </button>
      <button backgroundColor='purple' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Contacts = createComponent(() => {
  const { navigateTo: navigateTo$, goBack, match } = useNavigation();
  const navigateTo = useAnimatedNavigation(navigateTo$);

  return (
    <stack-layout backgroundColor='#66bb6a' height='100%'>
      <label>Contacts</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Home`)}>
        go to home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Settings`)}>
        go to settings
      </button>
      <button backgroundColor='purple' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Settings = createComponent(() => {
  const { navigateTo: navigateTo$, goBack, match } = useNavigation();
  const navigateTo = useAnimatedNavigation(navigateTo$);

  return (
    <stack-layout backgroundColor='#ec407a' height='100%'>
      <label>Settings</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Home`)}>
        go to home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Contacts`)}>
        go to contacts
      </button>
      <button backgroundColor='purple' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const useAnimatedNavigation =
  (navigateTo: (pathname: string, options?: NavigationOptions) => void) => (pathname: string) =>
    navigateTo(pathname, {
      animated: true,
      transition: { duration: 1000, curve: CoreTypes.AnimationCurve.spring, name: NavigationTransitionName.SLIDE },
    });

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <TabNavigator.Root>
        <TabNavigator.Screen name='Home' component={Home} />
        <TabNavigator.Screen name='Contacts' component={Contacts} />
        <TabNavigator.Screen name='Settings' component={Settings} />
      </TabNavigator.Root>
    </NavigationContainer>
  );
});

export default App;
