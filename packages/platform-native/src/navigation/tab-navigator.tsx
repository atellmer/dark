import { PropertyChangeData } from '@nativescript/core';
import {
  type ComponentFactory,
  type StandardComponentProps,
  h,
  createComponent,
  useState,
  useUpdate,
  useEvent,
  useRef,
  useLayoutEffect,
  batch,
  memo,
} from '@dark-engine/core';

import { type SyntheticEvent } from '../events';
import { StackNavigator, type StackNavigatorRef, type StackScreenProps } from './stack-navigator';

type TabNavigatorProps = {
  position?: 'top' | 'bottom';
  slot: Array<ComponentFactory<TabScreenProps & StandardComponentProps>>;
};

const descriptorsMap: Record<string, TabScreenProps> = {}; // TODO

const Navigator = createComponent<TabNavigatorProps>(({ position = 'bottom', slot }) => {
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
        stackNavigatorRef.current.push(pathname, { animated: true });
      });
    }
  });

  const handleNavigate = useEvent((_, idx: number) => setIdx(idx));

  const descriptorKeys = Object.keys(descriptorsMap);

  return (
    <grid-layout columns='*' rows={isBottom ? 'auto, *' : 'auto, auto'}>
      {descriptorKeys.length > 0 && (
        <stack-layout col={1} row={1}>
          <StackNavigator.Root ref={stackNavigatorRef} onNavigate={handleNavigate}>
            {descriptorKeys.map(key => {
              const { component, slot } = descriptorsMap[key];

              return (
                <StackNavigator.Screen key={key} name={key} component={component}>
                  {slot}
                </StackNavigator.Screen>
              );
            })}
          </StackNavigator.Root>
        </stack-layout>
      )}
      <tab-view
        col={1}
        row={2}
        androidTabsPosition={position}
        selectedIndex={idx}
        onSelectedIndexChange={handleIdxChange}>
        {slot}
      </tab-view>
    </grid-layout>
  );
});

type TabScreenProps = {} & StackScreenProps;

const Screen = createComponent<TabScreenProps>(({ name, component, slot }) => {
  descriptorsMap[name] = {
    name,
    component,
    slot,
  };

  return (
    <tab-view-item title={name} canBeLoaded>
      <label text='' />
    </tab-view-item>
  );
});

const TabNavigator = {
  Root: memo(Navigator),
  Screen,
};

export { TabNavigator };
