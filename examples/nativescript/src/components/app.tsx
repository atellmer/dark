import { isAndroid } from '@nativescript/core';
import { h, Fragment, component } from '@dark-engine/core';
import {
  ListView,
  ActionBar,
  Modal,
  NavigationButton,
  ActionItem,
  TouchableOpacity,
  StackLayout,
  FlexboxLayout,
  Label,
  Button,
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

const List = component(() => {
  const { navigateTo, match } = useAnimatedNavigation();

  return (
    <StackLayout backgroundColor='#512da8' height='100%'>
      <ListView
        height='100%'
        items={items}
        onItemTap={e => {
          navigateTo(`${match.pathname}/Profile`, { id: e.sourceEvent.index });
        }}>
        {({ item, idx }) => {
          return (
            <StackLayout backgroundColor={idx % 2 ? '#f48fb1' : '#fff59d'}>
              <Label color='black'>item #{item}</Label>
            </StackLayout>
          );
        }}
      </ListView>
    </StackLayout>
  );
});

const Profile = component(() => {
  const { navigateTo, goBack, match, pathname, params } = useAnimatedNavigation();
  const id = Number(params.get('id'));

  return (
    <StackLayout backgroundColor='#1976d2' height='100%'>
      <Label>Profile: {pathname}</Label>
      <Label>id: {id}</Label>
      <Button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/List`)}>
        go to List
      </Button>
      <Button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Dashboard`)}>
        go to Dashboard
      </Button>
      <Button backgroundColor='#d81b60' onTap={() => goBack()}>
        back
      </Button>
    </StackLayout>
  );
});

const Dashboard = component(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <StackLayout backgroundColor='#388e3c' height='100%'>
      <Label>Dashboard: {pathname}</Label>
      <Button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/Profile`)}>
        go to Profile
      </Button>
      <Button backgroundColor='#d81b60' onTap={() => navigateTo(`${match.pathname}/List`)}>
        go to List
      </Button>
      <Button backgroundColor='#d81b60' onTap={() => goBack()}>
        back
      </Button>
    </StackLayout>
  );
});

const Home = component(() => {
  return (
    <StackLayout backgroundColor='#26c6da' height='100%'>
      <StackNavigator.Root>
        <StackNavigator.Screen name='List' component={List} />
        <StackNavigator.Screen name='Profile' component={Profile} initialParams={{ id: -1 }} />
        <StackNavigator.Screen name='Dashboard' component={Dashboard} />
      </StackNavigator.Root>
    </StackLayout>
  );
});

const Contacts = component(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <StackLayout backgroundColor='#66bb6a' height='100%'>
      <Label>Contacts: {pathname}</Label>
      <Button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Home`)}>
        go to Home
      </Button>
      <Button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Settings`)}>
        go to Settings
      </Button>
      <Button backgroundColor='purple' onTap={() => goBack()}>
        back
      </Button>
    </StackLayout>
  );
});

const Settings = component(() => {
  const { navigateTo, goBack, match, pathname } = useAnimatedNavigation();

  return (
    <StackLayout backgroundColor='#ec407a' height='100%'>
      <Label>Settings: {pathname}</Label>
      <Button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Home`)}>
        go to Home
      </Button>
      <Button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Contacts`)}>
        go to Contacts
      </Button>
      <Button backgroundColor='purple' onTap={() => goBack()}>
        back
      </Button>
      <Button backgroundColor='purple' onTap={() => navigateTo(`${match.pathname}/Settings/Modal`)}>
        go to Setting/Modal
      </Button>
    </StackLayout>
  );
});

const ModalNavigator = component(() => {
  const { goBack, pathname } = useAnimatedNavigation();
  const isModalOpen = pathname.indexOf('/Modal') !== -1;

  return (
    <Modal isOpen={isModalOpen} animated>
      <StackLayout padding={32}>
        <Label>Hello from ModalNavigator</Label>
        <Button backgroundColor='purple' onTap={goBack}>
          close
        </Button>
      </StackLayout>
    </Modal>
  );
});

const App = component(() => {
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
            <FlexboxLayout color='#fff' marginLeft={-12}>
              <Label text='&#xe875;' class='lnr' fontSize={20}></Label>
              <Label fontSize={16}>back</Label>
            </FlexboxLayout>
          </TouchableOpacity>
        </ActionItem>
      </ActionBar>
    );
  };

  const renderTab = (name: string) => {
    const iconsMap = {
      Home: () => <Label class='lnr' text='&#xe800;' />,
      Contacts: () => <Label class='lnr' text='&#xe830;' />,
      Settings: () => <Label class='lnr' text='&#xe810;' />,
    };

    return (
      <>
        {iconsMap[name]()}
        <Label>{name}</Label>
      </>
    );
  };

  return (
    <NavigationContainer
      defaultPathname='/Home/List'
      renderActionBar={isAndroid ? renderAndroidActionBar : renderIOSActionBar}>
      <StackLayout>
        <TabNavigator.Root bottomNavigationOptions={{ compensate: isAndroid ? 0 : 64 }}>
          <TabNavigator.Screen name='Home' component={Home} renderTab={renderTab} />
          <TabNavigator.Screen name='Contacts' component={Contacts} renderTab={renderTab} />
          <TabNavigator.Screen name='Settings' component={Settings} renderTab={renderTab} />
        </TabNavigator.Root>
        <ModalNavigator />
      </StackLayout>
    </NavigationContainer>
  );
});

export { App };
