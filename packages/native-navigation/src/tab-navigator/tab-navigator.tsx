import { PropertyChangeData } from '@nativescript/core';
import {
  type ComponentFactory,
  type StandardComponentProps,
  h,
  createComponent,
  createContext,
  useState,
  useUpdate,
  useMemo,
  useEvent,
  useRef,
  useLayoutEffect,
  useContext,
  batch,
  memo,
} from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-native';

import { StackNavigator, type StackNavigatorRef, type StackScreenProps } from '../stack-navigator';
import { useNavigationContext } from '../navigation-container';

type TabNavigatorProps = {
  position?: 'top' | 'bottom';
  slot: Array<ComponentFactory<TabScreenProps & StandardComponentProps>>;
};

const Navigator = createComponent<TabNavigatorProps>(({ position = 'bottom', slot }) => {
  const { push } = useNavigationContext();
  const navRef = useRef<StackNavigatorRef>(null);
  const [idx, setIdx] = useState(0);
  const update = useUpdate();
  const contextValue = useMemo<TabNavigatorContextValue>(() => ({ descriptorsMap: {} }), []);
  const { descriptorsMap } = contextValue;
  const isBottom = position === 'bottom';

  useLayoutEffect(() => update(), []);

  const handleIdxChange = useEvent((e: SyntheticEvent<PropertyChangeData>) => {
    const nextIdx = Number(e.sourceEvent.value);

    if (nextIdx !== idx) {
      const pathname = navRef.current.getPathnameByIdx(nextIdx);

      batch(() => {
        setIdx(nextIdx);
        push(pathname, { animated: true });
      });
    }
  });

  const handleNavigate = useEvent((_, idx: number) => setIdx(idx));

  const descriptorKeys = Object.keys(descriptorsMap);

  return (
    <TabNavigatorContext.Provider value={contextValue}>
      <grid-layout columns='*' rows={isBottom ? 'auto, *' : 'auto, auto'}>
        <stack-layout col={1} row={1}>
          {descriptorKeys.length > 0 && (
            <StackNavigator.Root ref={navRef} onNavigate={handleNavigate}>
              {descriptorKeys.map(key => {
                const { component, slot } = descriptorsMap[key];

                return (
                  <StackNavigator.Screen key={key} name={key} component={component}>
                    {slot}
                  </StackNavigator.Screen>
                );
              })}
            </StackNavigator.Root>
          )}
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
    </TabNavigatorContext.Provider>
  );
});

type TabScreenProps = {
  title?: string;
  iconSource?: string;
  class?: string;
} & StackScreenProps;

const Screen = createComponent<TabScreenProps>(({ name, component, title, iconSource, class: className, slot }) => {
  const value = useTabNavigatorContext();

  value.descriptorsMap[name] = {
    name,
    component,
    slot,
  };

  return (
    <tab-view-item title={title || name} iconSource={iconSource} class={className} canBeLoaded>
      <label text='' />
    </tab-view-item>
  );
});

type TabNavigatorContextValue = {
  descriptorsMap: Record<string, TabScreenProps>;
};

const TabNavigatorContext = createContext<TabNavigatorContextValue>(null);

function useTabNavigatorContext() {
  const value = useContext(TabNavigatorContext);

  return value;
}

const TabNavigator = {
  Root: memo(Navigator),
  Screen,
};

export { TabNavigator };
