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
import { NS, ActionBar } from '@dark-engine/platform-native';

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
      const page = refsMap[nextName];
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
        <page>{slot}</page>
      </frame>
    );
  });

  type ScreenProps = {
    name: string;
    component: Component<RouteComponentProps>;
    options?: {
      hasActionBar: boolean;
    };
  };

  const Screen = createComponent<ScreenProps>(({ name, component, options = {} }) => {
    const setRef = (ref: NS.Page) => {
      refsMap[name] = ref;
    };

    return (
      <page id={name} ref={setRef} onNavigatingTo={() => setName(name)}>
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

type TestComponent = {
  title: string;
} & RouteComponentProps;

const TestComponent = createComponent<TestComponent>(({ title, navigateTo, goBack }) => {
  return (
    <stack-layout>
      <label>{title}</label>
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

// const App = createComponent(() => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name='Contacts' component={TestComponent} />
//       <Stack.Screen name='About' component={TestComponent} />
//       <Stack.Screen name='Home' component={TestComponent} />
//     </Stack.Navigator>
//   );
// });

const App = createComponent(() => {
  return (
    <frame>
      <page>
        <ActionBar title='hello world 2'>
          <stack-layout orientation='horizontal'>
            <label width='40' height='40' backgroundColor='red' verticalAlignment='middle' />
            <label text='ActionBar Title' fontSize='24' verticalAlignment='middle' />
          </stack-layout>
        </ActionBar>
      </page>
    </frame>
  );
});

export default App;
