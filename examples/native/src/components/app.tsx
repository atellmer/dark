import { h, Fragment, createComponent } from '@dark-engine/core';
import { createStackNavigator, createBottomTabNavigator, useNavigation } from '@dark-engine/platform-native';

const Home = createComponent(() => {
  const { navigateTo, goBack, prefix, pathname } = useNavigation();

  return (
    <stack-layout>
      <label>Contacts</label>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/Home`)}>
        Home
      </button>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/About`)}>
        About
      </button>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/Contacts`)}>
        Contacts
      </button>
    </stack-layout>
  );
});

const About = createComponent(() => {
  const { navigateTo, goBack, prefix } = useNavigation();

  return (
    <stack-layout>
      <label>About</label>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/Home`)}>
        Home
      </button>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/About`)}>
        About
      </button>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/Contacts`)}>
        Contacts
      </button>
    </stack-layout>
  );
});

const Contacts = createComponent(() => {
  const { navigateTo, goBack, prefix } = useNavigation();

  return (
    <stack-layout>
      <label>Contacts</label>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/Home`)}>
        Home
      </button>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/About`)}>
        About
      </button>
      <button backgroundColor='blueviolet' onTap={() => navigateTo(`${prefix}/Contacts`)}>
        Contacts
      </button>
    </stack-layout>
  );
});

const Tab = createBottomTabNavigator();

const App = createComponent(() => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} options={{ title: 'Home' }} />
      <Tab.Screen name='About' component={About} options={{ title: 'About' }} />
      <Tab.Screen name='Contacts' component={Contacts} options={{ title: 'Contacts' }} />
    </Tab.Navigator>
  );
});

export default App;
