import { AbsoluteLayout as NSAbsoluteLayout, Screen, View as NSView, Page as NSPage } from '@nativescript/core';
import { h, Fragment, createComponent, useRef, useEffect } from '@dark-engine/core';
import { NavigationContainer, useNavigation, createStackNavigator } from '@dark-engine/platform-native';

const Home = createComponent(() => {
  const { push, back, pathname } = useNavigation();

  return (
    <stack-layout backgroundColor='#26c6da' height='100%'>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => push('/Contacts')}>
        go to contacts
      </button>
      <button backgroundColor='purple' onTap={() => push('/Settings')}>
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

  return (
    <stack-layout backgroundColor='#66bb6a' height='100%'>
      <label>Contacts</label>
      <button backgroundColor='purple' onTap={() => push('/Home')}>
        go to home
      </button>
      <button backgroundColor='purple' onTap={() => push('/Settings')}>
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

  return (
    <stack-layout backgroundColor='#ec407a' height='100%'>
      <label>Contacts</label>
      <button backgroundColor='purple' onTap={() => push('/Home')}>
        go to home
      </button>
      <button backgroundColor='purple' onTap={() => push('/Contacts')}>
        go to contacts
      </button>
      <button backgroundColor='purple' onTap={() => back()}>
        back
      </button>
    </stack-layout>
  );
});

const Stack = createStackNavigator();

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home'>{() => <Home />}</Stack.Screen>
        <Stack.Screen name='Contacts'>{() => <Contacts />}</Stack.Screen>
        <Stack.Screen name='Settings'>{() => <Settings />}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;
