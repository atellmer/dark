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

const Account = createComponent(() => {
  const { navigateTo, goBack, match, pathname, params } = useAnimatedNavigation();
  const id = params['id'] as number;

  return (
    <stack-layout backgroundColor='#512da8' height='100%'>
      <label>Account: {pathname}</label>
      <label>id: {id}</label>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Profile`, { id: 12 })}>
        go to Profile
      </button>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Dashboard`)}>
        go to Dashboard
      </button>
      <button backgroundColor='#d81b60' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Profile = createComponent(() => {
  const { navigateTo, goBack, match, pathname, params } = useAnimatedNavigation();
  const id = params['id'] as number;

  return (
    <stack-layout backgroundColor='#1976d2' height='100%'>
      <label>Profile: {pathname}</label>
      <label>id: {id}</label>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Account`, { id: 10 })}>
        go to Account
      </button>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Dashboard`)}>
        go to Dashboard
      </button>
      <button backgroundColor='#d81b60' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Dashboard = createComponent(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <stack-layout backgroundColor='#388e3c' height='100%'>
      <label>Dashboard: {pathname}</label>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Profile`)}>
        go to Profile
      </button>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Account`)}>
        go to Account
      </button>
      <button backgroundColor='#d81b60' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Home = createComponent(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <stack-layout backgroundColor='#26c6da' height='100%'>
      <StackNavigator.Root>
        <StackNavigator.Screen name='Account' component={Account} initialParams={{ id: -1 }} />
        <StackNavigator.Screen name='Profile' component={Profile} initialParams={{ id: -2 }} />
        <StackNavigator.Screen name='Dashboard' component={Dashboard} />
      </StackNavigator.Root>
    </stack-layout>
  );
});

const Contacts = createComponent(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <stack-layout backgroundColor='#66bb6a' height='100%'>
      <label>Contacts: {pathname}</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Home`)}>
        go to Home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Settings`)}>
        go to Settings
      </button>
      <button backgroundColor='purple' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Settings = createComponent(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <stack-layout backgroundColor='#ec407a' height='100%'>
      <label>Settings: {pathname}</label>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Home`)}>
        go to Home
      </button>
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Contacts`)}>
        go to Contacts
      </button>
      <button backgroundColor='purple' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

function useAnimatedNavigation() {
  const { navigateTo, ...rest } = useNavigation();

  return {
    navigateTo: (pathname: string, params?: Record<string, string | number>) =>
      navigateTo(pathname, {
        animated: true,
        params,
        //transition: { duration: 1000, curve: CoreTypes.AnimationCurve.spring, name: NavigationTransitionName.SLIDE },
      }),
    ...rest,
  };
}

const App = createComponent(() => {
  return (
    <NavigationContainer>
      <TabNavigator.Root>
        <TabNavigator.Screen name='Home' title='&#xe800;' class='lnr' component={Home} />
        <TabNavigator.Screen name='Contacts' title='&#xe830;' class='lnr' component={Contacts} />
        <TabNavigator.Screen name='Settings' title='&#xe810;' class='lnr' component={Settings} />
      </TabNavigator.Root>
    </NavigationContainer>
  );
});

export default App;
