import {
  AbsoluteLayout as NSAbsoluteLayout,
  Screen,
  View as NSView,
  Page as NSPage,
  CoreTypes,
} from '@nativescript/core';
import { h, Fragment, createComponent, useRef, useEffect } from '@dark-engine/core';
import {
  NavigationContainer,
  useNavigation,
  StackNavigator,
  NavigationTransitionName,
  type NavigationOptions,
} from '@dark-engine/platform-native';

const Home = createComponent(() => {
  const { push, back, pathname } = useNavigation();
  const animatedPush = useAnimatedPush(push);

  return (
    <stack-layout backgroundColor='#26c6da' height='100%'>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => animatedPush('/Contacts')}>
        go to contacts
      </button>
      <button backgroundColor='purple' onTap={() => animatedPush('/Settings')}>
        go to settings
      </button>
      <button backgroundColor='purple' onTap={() => back()}>
        back
      </button>
    </stack-layout>
  );
});

const Contacts = createComponent(() => {
  const { push, back, pathname } = useNavigation();
  const animatedPush = useAnimatedPush(push);

  return (
    <stack-layout backgroundColor='#66bb6a' height='100%'>
      <label>Contacts</label>
      <button backgroundColor='purple' onTap={() => animatedPush('/Home')}>
        go to home
      </button>
      <button backgroundColor='purple' onTap={() => animatedPush('/Settings')}>
        go to settings
      </button>
      <button backgroundColor='purple' onTap={() => back()}>
        back
      </button>
    </stack-layout>
  );
});

const Settings = createComponent(() => {
  const { push, back, pathname } = useNavigation();
  const animatedPush = useAnimatedPush(push);

  return (
    <stack-layout backgroundColor='#ec407a' height='100%'>
      <label>Settings</label>
      <button backgroundColor='purple' onTap={() => animatedPush('/Home')}>
        go to home
      </button>
      <button backgroundColor='purple' onTap={() => animatedPush('/Contacts')}>
        go to contacts
      </button>
      <button backgroundColor='purple' onTap={() => back()}>
        back
      </button>
    </stack-layout>
  );
});

const useAnimatedPush = (push: (pathname: string, options?: NavigationOptions) => void) => (pathname: string) =>
  push(pathname, {
    animated: true,
    transition: { duration: 1000, curve: CoreTypes.AnimationCurve.spring, name: NavigationTransitionName.SLIDE },
  });

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <StackNavigator.Root>
        <StackNavigator.Screen name='Home' component={Home} />
        <StackNavigator.Screen name='Contacts' component={Contacts} />
        <StackNavigator.Screen name='Settings' component={Settings} />
      </StackNavigator.Root>
    </NavigationContainer>
  );
});

export default App;
