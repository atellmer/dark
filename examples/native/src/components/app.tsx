import { h, Fragment, createComponent } from '@dark-engine/core';
import { createStackNavigator, createBottomTabNavigator, useNavigation } from '@dark-engine/platform-native';

type TestComponentProps = {
  title: string;
};

const TestComponent = createComponent<TestComponentProps>(({ title }) => {
  const { navigateTo, goBack, prefix } = useNavigation();

  return (
    <>
      <stack-layout>
        <label>{title}</label>
        <button backgroundColor='blue' onTap={() => navigateTo(`${prefix}/Account`)}>
          go to Account
        </button>
        <button backgroundColor='purple' onTap={() => navigateTo(`${prefix}/Profile`)}>
          go to Profile
        </button>
        <button backgroundColor='yellow' color='black' onTap={() => navigateTo(`${prefix}/Settings`)}>
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

// const Home = createComponent(props => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name='Account' component={Account} />
//       <Tab.Screen name='Profile' component={Profile} />
//       <Tab.Screen name='Settings' component={Settings} />
//     </Tab.Navigator>
//   );
// });

const About = createComponent(() => <label>About</label>);

const Contacts = createComponent(() => <label>Contacts</label>);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = createComponent(() => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Account' component={Account} options={{ title: 'Account' }} />
      <Tab.Screen name='Profile' component={Profile} options={{ title: 'Profile' }} />
      <Tab.Screen name='Settings' component={Settings} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
});

export default App;
