import { AbsoluteLayout as NSAbsoluteLayout, Screen, View as NSView, Page as NSPage } from '@nativescript/core';
import { h, Fragment, createComponent, useRef, useEffect } from '@dark-engine/core';
import { NavigationContaier, useNavigation } from '@dark-engine/platform-native';

const Home = createComponent(() => {
  const { pathname, navigateTo, goBack } = useNavigation();

  return (
    <stack-layout>
      <label>url: {pathname}</label>
      <button backgroundColor='purple' onTap={() => navigateTo('/home')}>
        forward
      </button>
      <button backgroundColor='purple' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const App = createComponent(() => {
  return (
    <NavigationContaier>
      <Home />
    </NavigationContaier>
  );
});

export default App;
