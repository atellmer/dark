import { PropertyChangeData } from '@nativescript/core';

import {
  type ComponentFactory,
  type StandardComponentProps,
  createComponent,
  useState,
  useUpdate,
  useEvent,
  useRef,
  useLayoutEffect,
  batch,
} from '@dark-engine/core';
import { type SyntheticEvent } from '../events';
import { type StackNavigatorRef, createStackNavigator, type StackScreenProps } from './stack-navigator';
import { frame, page, gridLayout, stackLayout, tabView, tabViewItem, label } from '../factory';

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
    const stackNavigatorRef = useRef<StackNavigatorRef>(null);
    const [idx, setIdx] = useState(0);
    const update = useUpdate();
    const isBottom = position === 'bottom';

    useLayoutEffect(() => update(), []);

    const handleIdxChange = useEvent((e: SyntheticEvent<PropertyChangeData>) => {
      const nextIdx = Number(e.sourceEvent.value);

      if (nextIdx !== idx) {
        const pathname = stackNavigatorRef.current.getPathnameByIdx(nextIdx);

        batch(() => {
          setIdx(nextIdx);
          stackNavigatorRef.current.navigateTo(pathname);
        });
      }
    });

    const handleNavigate = useEvent((_, idx: number) => setIdx(idx));

    const descriptorKeys = Object.keys(descriptorsMap);

    return frame({
      slot: page({
        actionBarHidden: true,
        slot: gridLayout({
          columns: '*',
          rows: isBottom ? 'auto, *' : 'auto, auto',
          slot: [
            descriptorKeys.length > 0 &&
              stackLayout({
                col: 1,
                row: 1,
                slot: Stack.Navigator({
                  ref: stackNavigatorRef,
                  onNavigate: handleNavigate,
                  slot: descriptorKeys.map(key => {
                    const { component, options } = descriptorsMap[key];

                    return Stack.Screen({ key, name: key, component, options });
                  }),
                }),
              }),
            tabView({
              col: 1,
              row: 2,
              androidTabsPosition: position,
              selectedIndex: idx,
              onSelectedIndexChange: handleIdxChange,
              slot,
            }),
          ],
        }),
      }),
    });
  });

  const Screen = createComponent<TabScreenProps>(({ name, component, options }) => {
    descriptorsMap[name] = {
      name,
      component,
      options,
    };

    return tabViewItem({
      title: name,
      canBeLoaded: true,
      slot: label({ text: '' }),
    });
  });

  return {
    Navigator,
    Screen,
  };
}

const createBottomTabNavigator = () => createTabNavigator('bottom');

const createTopTabNavigator = () => createTabNavigator('top');

export { createBottomTabNavigator, createTopTabNavigator };
