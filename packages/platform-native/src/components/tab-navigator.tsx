import { PropertyChangeData } from '@nativescript/core';

import {
  type ComponentFactory,
  type StandardComponentProps,
  h,
  createComponent,
  useState,
  useUpdate,
  useEvent,
  useMemo,
  useRef,
  useLayoutEffect,
} from '@dark-engine/core';
import { type SyntheticEvent } from '../events';
import { type StackNavigatorRef, createStackNavigator, type StackScreenProps } from './stack-navigator';

type Position = 'top' | 'bottom';

type TabNavigatorProps = {
  slot: Array<ComponentFactory<TabScreenProps & StandardComponentProps>>;
};

type TabScreenProps = StackScreenProps;

type Descriptor = TabScreenProps;

function createTabNavigator(position: Position) {
  const Stack = createStackNavigator();
  const descriptorsMap: Record<string, Descriptor> = {};

  const Navigator = createComponent<TabNavigatorProps>(({ slot }) => {
    const names = useMemo(() => slot.map(x => x.props.name), []);
    const byIdxMap: Record<string, string> = useMemo(
      () => names.reduce((acc, name, idx) => ((acc[idx] = name), acc), {}),
      [names],
    );
    const byNameMap: Record<string, number> = useMemo(
      () => names.reduce((acc, name, idx) => ((acc[name] = idx), acc), {}),
      [names],
    );
    const stackNavigatorRef = useRef<StackNavigatorRef>(null);
    const [idx, setIdx] = useState(0);
    const update = useUpdate();
    const isBottom = position === 'bottom';

    useLayoutEffect(() => {
      update();
    }, []);

    const handleIdxChange = useEvent((e: SyntheticEvent<PropertyChangeData>) => {
      const nextIdx = Number(e.sourceEvent.value);

      if (nextIdx !== idx) {
        const name = byIdxMap[nextIdx];

        setIdx(nextIdx);
        stackNavigatorRef.current.navigateTo(name);
      }
    });

    const handleNavigate = useEvent((name: string) => {
      const idx = byNameMap[name];

      setIdx(idx);
    });

    return (
      <frame>
        <page actionBarHidden>
          <grid-layout columns='*' rows={isBottom ? 'auto, *' : 'auto, auto'}>
            <stack-layout col={1} row={1}>
              <Stack.Navigator ref={stackNavigatorRef} onNavigate={handleNavigate}>
                {Object.keys(descriptorsMap).map(key => {
                  const { component, options } = descriptorsMap[key];

                  return <Stack.Screen key={key} name={key} component={component} options={options} />;
                })}
              </Stack.Navigator>
            </stack-layout>
            <tab-view
              col={1}
              row={2}
              androidTabsPosition={position}
              selectedIndex={idx}
              onSelectedIndexChange={handleIdxChange}>
              {slot}
            </tab-view>
          </grid-layout>
        </page>
      </frame>
    );
  });

  const Screen = createComponent<TabScreenProps>(({ name, component, options }) => {
    descriptorsMap[name] = {
      name,
      component,
      options,
    };

    return (
      <tab-view-item title={name} canBeLoaded>
        <label text='' />
      </tab-view-item>
    );
  });

  return {
    Navigator,
    Screen,
  };
}

const createBottomTabNavigator = () => createTabNavigator('bottom');

const createTopTabNavigator = () => createTabNavigator('top');

export { createBottomTabNavigator, createTopTabNavigator };
