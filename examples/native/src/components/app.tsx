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
    <Tab.Navigator>
      <Tab.Screen name='Account' component={Account} />
      <Tab.Screen name='Profile' component={Profile} />
      <Tab.Screen name='Settings' component={Settings} />
    </Tab.Navigator>
  );
});

const About = createComponent(() => <label>About</label>);

const Contacts = createComponent(() => <label>Contacts</label>);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name='About' component={About} options={{ title: 'About' }} />
        <Stack.Screen name='Contacts' component={Contacts} options={{ title: 'Contacts' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;
