import { isAndroid } from '@nativescript/core';
import { h, Fragment, createComponent } from '@dark-engine/core';
import {
  ListView,
  ActionBar,
  Modal,
  NavigationButton,
  ActionItem,
  TouchableOpacity,
} from '@dark-engine/platform-native';
import {
  type RenderActionBarOptions,
  NavigationContainer,
  useNavigation,
  StackNavigator,
  TabNavigator,
} from '@dark-engine/native-navigation';

const items = Array(1000)
  .fill(null)
  .map((_, idx) => idx);

function useAnimatedNavigation() {
  const { navigateTo, ...rest } = useNavigation();

  return {
    navigateTo: (pathname: string, params?: Record<string, string | number>) =>
      navigateTo(pathname, {
        animated: true,
        params,
      }),
    ...rest,
  };
}

const List = createComponent(() => {
  const { navigateTo, match } = useAnimatedNavigation();

  return (
    <stack-layout backgroundColor='#512da8' height='100%'>
      <ListView
        height='100%'
        items={items}
        onItemTap={e => {
          navigateTo(`${match.pathname}/Profile`, { id: e.sourceEvent.index });
        }}>
        {({ item, idx }) => {
          return (
            <stack-layout backgroundColor={idx % 2 ? '#f48fb1' : '#fff59d'}>
              <label color='black'>item #{item}</label>
            </stack-layout>
          );
        }}
      </ListView>
    </stack-layout>
  );
});

const Profile = createComponent(() => {
  const { navigateTo, goBack, match, pathname, params } = useAnimatedNavigation();
  const id = Number(params.get('id'));

  return (
    <stack-layout backgroundColor='#1976d2' height='100%'>
      <label>Profile: {pathname}</label>
      <label>id: {id}</label>
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/List`)}>
        go to List
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
      <button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/List`)}>
        go to List
      </button>
      <button backgroundColor='#d81b60' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Home = createComponent(() => {
  return (
    <stack-layout backgroundColor='#26c6da' height='100%'>
      <StackNavigator.Root>
        <StackNavigator.Screen name='List' component={List} />
        <StackNavigator.Screen name='Profile' component={Profile} initialParams={{ id: -1 }} />
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
      <button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Settings/Modal`)}>
        go to Setting/Modal
      </button>
    </stack-layout>
  );
});

const ModalNavigator = createComponent(() => {
  const { goBack, pathname } = useAnimatedNavigation();
  const isModalOpen = pathname.indexOf('/Modal') !== -1;

  return (
    <Modal isOpen={isModalOpen} animated>
      <stack-layout padding={32}>
        <label>Hello from ModalNavigator</label>
        <button backgroundColor='purple' onTap={goBack}>
          close
        </button>
      </stack-layout>
    </Modal>
  );
});

const App = createComponent(() => {
  const renderAndroidActionBar = ({ pathname, goBack }: RenderActionBarOptions) => {
    return (
      <ActionBar title={pathname}>
        <NavigationButton text='Go back' android={{ systemIcon: 'ic_menu_back' }} onTap={goBack}></NavigationButton>
      </ActionBar>
    );
  };

  const renderIOSActionBar = ({ pathname, goBack }: RenderActionBarOptions) => {
    return (
      <ActionBar title={pathname}>
        <NavigationButton visibility='collapse' />
        <ActionItem ios={{ position: 'left' } as any}>
          <TouchableOpacity onPress={goBack}>
            <flexbox-layout color='#fff' marginLeft={-12}>
              <label text='&#xe875;' class='lnr' fontSize={20}></label>
              <label fontSize={16}>back</label>
            </flexbox-layout>
          </TouchableOpacity>
        </ActionItem>
      </ActionBar>
    );
  };

  const renderTab = (name: string) => {
    const iconsMap = {
      Home: () => <label class='lnr' text='&#xe800;' />,
      Contacts: () => <label class='lnr' text='&#xe830;' />,
      Settings: () => <label class='lnr' text='&#xe810;' />,
    };

    return (
      <>
        {iconsMap[name]()}
        <label>{name}</label>
      </>
    );
  };

  return (
    <NavigationContainer
      defaultPathname='/Home/List'
      renderActionBar={isAndroid ? renderAndroidActionBar : renderIOSActionBar}>
      <stack-layout>
        <TabNavigator.Root bottomNavigationOptions={{ compensate: isAndroid ? 0 : 64 }}>
          <TabNavigator.Screen name='Home' component={Home} renderTab={renderTab} />
          <TabNavigator.Screen name='Contacts' component={Contacts} renderTab={renderTab} />
          <TabNavigator.Screen name='Settings' component={Settings} renderTab={renderTab} />
        </TabNavigator.Root>
        <ModalNavigator />
      </stack-layout>
    </NavigationContainer>
  );
});

export { App };
