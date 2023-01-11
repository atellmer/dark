import { h, Fragment, createComponent } from '@dark-engine/core';
import { createStackNavigator, createBottomTabNavigator, useNavigation } from '@dark-engine/platform-native';

const Profile = createComponent(() => {
  const { navigateTo, goBack, prefix, pathname } = useNavigation();

  return (
    <stack-layout>
      <label>Profile</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Profile`)}>
        Profile
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Account`)}>
        Account
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Settings`)}>
        Settings
      </button>
    </stack-layout>
  );
});

const Account = createComponent(() => {
  const { navigateTo, goBack, prefix, pathname } = useNavigation();

  return (
    <stack-layout>
      <label>Account</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Profile`)}>
        Profile
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Account`)}>
        Account
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Settings`)}>
        Settings
      </button>
    </stack-layout>
  );
});

const Settings = createComponent(() => {
  const { navigateTo, goBack, prefix, pathname } = useNavigation();

  return (
    <stack-layout>
      <label>Settings</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Profile`)}>
        Profile
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Account`)}>
        Account
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Settings`)}>
        Settings
      </button>
    </stack-layout>
  );
});

const HomeStack = createStackNavigator();

const Home = createComponent(() => {
  const { navigateTo, goBack, prefix, pathname } = useNavigation();

  return (
    <stack-layout>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Home`)}>
        Home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/About`)}>
        About
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Contacts`)}>
        Contacts
      </button>
      <stack-layout>
        <HomeStack.Navigator>
          <HomeStack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
          <HomeStack.Screen name='Account' component={Account} options={{ headerShown: false }} />
          <HomeStack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
        </HomeStack.Navigator>
      </stack-layout>
    </stack-layout>
  );
});

const About = createComponent(() => {
  const { navigateTo, goBack, prefix } = useNavigation();

  return (
    <stack-layout>
      <label>About</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Home`)}>
        Home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/About`)}>
        About
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Contacts`)}>
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
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Home`)}>
        Home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/About`)}>
        About
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Contacts`)}>
        Contacts
      </button>
    </stack-layout>
  );
});

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const App = createComponent(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} options={{ title: 'Home' }} />
      <Stack.Screen name='About' component={About} options={{ title: 'About' }} />
      <Stack.Screen name='Contacts' component={Contacts} options={{ title: 'Contacts' }} />
    </Stack.Navigator>
  );
});

export default App;
