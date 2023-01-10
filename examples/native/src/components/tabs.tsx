import { Frame, PropertyChangeData, Page, TabView } from '@nativescript/core';
import {
  type Component,
  type ComponentFactory,
  type DarkElement,
  type StandardComponentProps,
  h,
  Fragment,
  createComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  batch,
} from '@dark-engine/core';
import { type TagNativeElement, type SyntheticEvent, NS } from '@dark-engine/platform-native';

let navigateTo = (name: string) => {};

type TabNavigatorProps = {
  slot: Array<ComponentFactory<TabScreenProps & StandardComponentProps>>;
};

const TabNavigator = createComponent<TabNavigatorProps>(({ slot }) => {
  const names = slot.map(x => x.props.name);
  const byIdxMap: Record<string, string> = names.reduce((acc, name, idx) => ((acc[idx] = name), acc), {});
  const byNameMap: Record<string, number> = names.reduce((acc, name, idx) => ((acc[name] = idx), acc), {});
  const [name, setName] = useState(names[0]);
  const [idx, setIdx] = useState(0);

  const handleIdxChange = (e: SyntheticEvent<PropertyChangeData>) => {
    const nextIdx = Number(e.sourceEvent.value);

    if (nextIdx !== idx) {
      const name = byIdxMap[nextIdx];

      batch(() => {
        setName(name);
        setIdx(nextIdx);
      });
    }
  };

  navigateTo = (nextName: string) => {
    const idx = byNameMap[nextName];

    batch(() => {
      setName(name);
      setIdx(idx);
    });
  };

  return (
    <frame>
      <page actionBarHidden>
        <tab-view selectedIndex={idx} androidTabsPosition='bottom' onSelectedIndexChange={handleIdxChange}>
          {slot}
        </tab-view>
      </page>
    </frame>
  );
});

type TabScreenProps = {
  name: string;
  component: Component;
};

const TabScreen = createComponent<TabScreenProps>(({ name, component }) => {
  return (
    <tab-view-item title={name}>
      <frame>
        <page id={name} actionBarHidden>
          {component()}
        </page>
      </frame>
    </tab-view-item>
  );
});

const Tab = {
  Navigator: TabNavigator,
  Screen: TabScreen,
};

const Home = createComponent(() => {
  return (
    <stack-layout>
      <label>Home</label>
      <button backgroundColor='purple' onTap={() => navigateTo('About')}>
        go to About
      </button>
    </stack-layout>
  );
});

const About = createComponent(() => {
  return (
    <stack-layout>
      <label>About</label>
      <button backgroundColor='yellow' color='black' onTap={() => navigateTo('Contacts')}>
        go to Contacts
      </button>
    </stack-layout>
  );
});

const Contacts = createComponent(() => {
  return (
    <stack-layout>
      <label>Contacts</label>
      <button backgroundColor='blue' onTap={() => navigateTo('Home')}>
        go to Home
      </button>
    </stack-layout>
  );
});

const App = createComponent(() => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='About' component={About} />
      <Tab.Screen name='Contacts' component={Contacts} />
    </Tab.Navigator>
  );
});

export default App;
