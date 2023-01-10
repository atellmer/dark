import { h, Fragment, createComponent } from '@dark-engine/core';
import {
  NavigationContainer,
  createStackNavigator,
  createBottomTabNavigator,
  useNavigation,
} from '@dark-engine/platform-native';

type TestComponentProps = {
  title: string;
};

const TestComponent = createComponent<TestComponentProps>(({ title }) => {
  const { navigateTo, goBack } = useNavigation();

  return (
    <>
      <stack-layout>
        <label>{title}</label>
        <button backgroundColor='blue' onTap={() => navigateTo('Account')}>
          go to Account
        </button>
        <button backgroundColor='purple' onTap={() => navigateTo('Profile')}>
          go to Profile
        </button>
        <button backgroundColor='yellow' color='black' onTap={() => navigateTo('Settings')}>
          go to Settings
        </button>
        <button backgroundColor='blue' onTap={() => goBack()}>
          back
        </button>
      </stack-layout>
    </>
  );
});

const Account = createComponent(props => <TestComponent title='Account' />);

const Profile = createComponent(props => <TestComponent title='Profile' />);

const Settings = createComponent(props => <TestComponent title='Settings' />);

const Home = createComponent(props => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Settings' component={Settings} options={{ title: 'Settings' }} />
      <Stack.Screen name='Profile' component={Profile} options={{ title: 'Profile' }} />
      <Stack.Screen name='Account' component={Account} options={{ title: 'Account' }} />
    </Stack.Navigator>
  );
});

const About = createComponent(() => <label>About</label>);

const Contacts = createComponent(() => <label>Contacts</label>);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name='About' component={About} />
        <Tab.Screen name='Contacts' component={Contacts} />
      </Tab.Navigator>
    </NavigationContainer>
  );
});

export default App;
