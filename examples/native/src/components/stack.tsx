import { Frame } from '@nativescript/core';
import {
  type Component,
  type DarkElement,
  type ComponentFactory,
  type StandardComponentProps,
  h,
  Fragment,
  createComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from '@dark-engine/core';
import { NS } from '@dark-engine/platform-native';

function createStackNavigator() {
  const refsMap: Record<string, NS.Page> = {};
  let navigateTo: (name: string) => void;
  let goBack: () => void;
  let name = '';
  let setName: (name: string) => void;

  type NavigatorProps = {
    slot: Array<ComponentFactory<ScreenProps & StandardComponentProps>>;
  };

  const Navigator = createComponent<NavigatorProps>(({ slot }) => {
    const defaultName = slot[slot.length - 1].props.name;
    const frameRef = useRef<NS.Frame>(null);
    [name, setName] = useState(defaultName);

    navigateTo = (nextName: string) => {
      if (nextName === name) return;
      const ref = refsMap[nextName];
      const page = ref as NS.Page;
      const frame = frameRef.current;

      page.parent?._removeView(page);
      frame.navigate({
        create: () => page,
        animated: true,
        transition: {
          name: 'slide',
          duration: 200,
        },
      });
      setName(nextName);
    };

    goBack = () => {
      const frame = frameRef.current;

      frame.goBack();
    };

    return (
      <frame ref={frameRef}>
        <page actionBarHidden>{slot}</page>
      </frame>
    );
  });

  type ScreenProps = {
    name: string;
    component: Component<RouteComponentProps>;
  };

  const Screen = createComponent<ScreenProps>(({ name, component }) => {
    const setRef = (ref: NS.Page) => {
      refsMap[name] = ref;
    };

    return (
      <page id={name} ref={setRef} actionBarHidden onNavigatingTo={() => setName(name)}>
        {component({ navigateTo, goBack })}
      </page>
    );
  });

  return {
    Navigator,
    Screen,
  };
}

type RouteComponentProps = {
  navigateTo: (name: string) => void;
  goBack: () => void;
};

const Home = createComponent<RouteComponentProps>(({ navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => navigateTo('About')}>
        go to About
      </button>
      <button backgroundColor='yellow' color='black' onTap={() => navigateTo('Contacts')}>
        go to Contacts
      </button>
      <button backgroundColor='blue' onTap={() => navigateTo('Home')}>
        go to Home
      </button>
      <button backgroundColor='blue' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Account = createComponent<RouteComponentProps>(({ navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>Account</label>
      <button backgroundColor='purple' onTap={() => navigateTo('Profile')}>
        go to Profile
      </button>
    </stack-layout>
  );
});

const Profile = createComponent<RouteComponentProps>(({ navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>Profile</label>
      <button backgroundColor='purple' onTap={() => navigateTo('Settings')}>
        go to Settings
      </button>
    </stack-layout>
  );
});

const Settings = createComponent<RouteComponentProps>(({ navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>Settings</label>
      <button backgroundColor='purple' onTap={() => navigateTo('Account')}>
        go to Account
      </button>
    </stack-layout>
  );
});

const About = createComponent<RouteComponentProps>(({ navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>About</label>
      <button backgroundColor='purple' onTap={() => navigateTo('About')}>
        go to About
      </button>
      <button backgroundColor='yellow' color='black' onTap={() => navigateTo('Contacts')}>
        go to Contacts
      </button>
      <button backgroundColor='blue' onTap={() => navigateTo('Home')}>
        go to Home
      </button>
      <button backgroundColor='blue' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Contacts = createComponent<RouteComponentProps>(({ navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>Contacts</label>
      <button backgroundColor='purple' onTap={() => navigateTo('About')}>
        go to About
      </button>
      <button backgroundColor='yellow' color='black' onTap={() => navigateTo('Contacts')}>
        go to Contacts
      </button>
      <button backgroundColor='blue' onTap={() => navigateTo('Home')}>
        go to Home
      </button>
      <button backgroundColor='blue' onTap={() => goBack()}>
        back
      </button>
    </stack-layout>
  );
});

const Stack = createStackNavigator();

const App = createComponent(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Contacts' component={Contacts} />
      <Stack.Screen name='About' component={About} />
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
});

export default App;
