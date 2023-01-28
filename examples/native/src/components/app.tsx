import { AbsoluteLayout as NSAbsoluteLayout, Screen, View as NSView, Page as NSPage } from '@nativescript/core';
import { h, Fragment, createComponent, useRef, useEffect } from '@dark-engine/core';
import { NavigationContainer, useNavigation, createStackNavigator } from '@dark-engine/platform-native';

const Home = createComponent(() => {
  return (
    <stack-layout>
      <label>home</label>
      <button backgroundColor='purple' onTap={() => {}}>
        forward
      </button>
      <button backgroundColor='purple' onTap={() => {}}>
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
        <Stack.Screen name='Contacts'>{() => <label>Contacts</label>}</Stack.Screen>
        <Stack.Screen name='Settings'>{() => <label>Settings</label>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;
