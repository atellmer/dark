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
import { type TagNativeElement, NS } from '@dark-engine/platform-native';

function createStackNavigator() {
  const refsMap: Record<string, TagNativeElement<NS.Page>> = {};

  type NavigatorProps = {
    slot: Array<ComponentFactory<ScreenProps & StandardComponentProps>>;
  };

  let navigateTo = (name: string) => {};

  let path = '';
  let setPath = (name: string) => {};

  const Navigator = createComponent<NavigatorProps>(({ slot }) => {
    const defaultName = slot[slot.length - 1].props.name;
    const frameRef = useRef<TagNativeElement<NS.Frame>>(null);
    [path, setPath] = useState(defaultName);

    navigateTo = (path: string) => {
      const ref = refsMap[path];
      const page = ref.getNativeView() as NS.Page;
      const frame = frameRef.current.getNativeView();

      page.parent?._removeView(page);
      frame.navigate({
        create: () => page,
        animated: true,
        transition: {
          name: 'slide',
          duration: 200,
        },
      });
      setPath(path);
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
    const setRef = (ref: TagNativeElement<NS.Page>) => {
      refsMap[name] = ref;
    };

    return (
      <page id={name} ref={setRef} actionBarHidden onNavigatingTo={() => setPath(name)}>
        {component({ navigateTo })}
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
};

const Home = createComponent<RouteComponentProps>(({ navigateTo }) => {
  return (
    <stack-layout>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => navigateTo('About')}>
        go to About
      </button>
    </stack-layout>
  );
});

const About = createComponent<RouteComponentProps>(({ navigateTo }) => {
  return (
    <stack-layout>
      <label>About</label>
      <button backgroundColor='yellow' color='black' onTap={() => navigateTo('Contacts')}>
        go to Contacts
      </button>
    </stack-layout>
  );
});

const Contacts = createComponent<RouteComponentProps>(({ navigateTo }) => {
  return (
    <stack-layout>
      <label>Contacts</label>
      <button backgroundColor='blue' onTap={() => navigateTo('Home')}>
        go to Home
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
