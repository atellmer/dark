import { PropertyChangeData } from '@nativescript/core';

import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  h,
  createComponent,
  useState,
  useEvent,
  useMemo,
  batch,
} from '@dark-engine/core';
import { type SyntheticEvent } from '../events';
import { useNavigationContainerContext } from './navigation-container';

type Position = 'top' | 'bottom';

function createTabNavigator(position: Position) {
  type TabNavigatorProps = {
    slot: Array<ComponentFactory<TabScreenProps & StandardComponentProps>>;
  };

  const Navigator = createComponent<TabNavigatorProps>(({ slot }) => {
    const contextValue = useNavigationContainerContext();
    const names = useMemo(() => slot.map(x => x.props.name), []);
    const byIdxMap: Record<string, string> = useMemo(
      () => names.reduce((acc, name, idx) => ((acc[idx] = name), acc), {}),
      [names],
    );
    const byNameMap: Record<string, number> = useMemo(
      () => names.reduce((acc, name, idx) => ((acc[name] = idx), acc), {}),
      [names],
    );
    const [name, setName] = useState(names[0]);
    const [idx, setIdx] = useState(0);

    const handleIdxChange = useEvent((e: SyntheticEvent<PropertyChangeData>) => {
      const nextIdx = Number(e.sourceEvent.value);

      if (nextIdx !== idx) {
        const name = byIdxMap[nextIdx];

        batch(() => {
          setName(name);
          setIdx(nextIdx);
        });
      }
    });

    const navigateTo = useEvent((nextName: string) => {
      const idx = byNameMap[nextName];

      batch(() => {
        setName(name);
        setIdx(idx);
      });
    });

    contextValue.navigateTo = navigateTo;
    contextValue.goBack = () => {};

    return (
      <frame>
        <page actionBarHidden>
          <tab-view selectedIndex={idx} androidTabsPosition={position} onSelectedIndexChange={handleIdxChange}>
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

  const Screen = createComponent<TabScreenProps>(({ name, component }) => {
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

  return {
    Navigator,
    Screen,
  };
}

const createBottomTabNavigator = () => createTabNavigator('bottom');

const createTopTabNavigator = () => createTabNavigator('top');

export { createBottomTabNavigator, createTopTabNavigator };
