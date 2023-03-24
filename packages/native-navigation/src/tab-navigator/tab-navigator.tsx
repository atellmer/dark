import { type AbsoluteLayout, type StackLayout, AccessibilityRole } from '@nativescript/core';
import {
  type DarkElement,
  type Component,
  type StandardComponentProps,
  h,
  component,
  createContext,
  useUpdate,
  useMemo,
  useEvent,
  useRef,
  useLayoutEffect,
  useContext,
  memo,
} from '@dark-engine/core';

import {
  type StackNavigatorRef,
  type StackScreenProps,
  StackNavigator,
  useScreenNavigatorContext,
} from '../stack-navigator';
import { useNavigationContext } from '../navigation-container';
import { createPathname, detectIsMatch } from '../utils';

type TabNavigatorProps = {
  bottomNavigationOptions?: Partial<BottomNavigationOptions>;
  slot: Array<Component<TabScreenProps & StandardComponentProps>>;
};

const Navigator = component<TabNavigatorProps>(
  ({ bottomNavigationOptions, slot }) => {
    const navRef = useRef<StackNavigatorRef>(null);
    const layoutRef = useRef<AbsoluteLayout>(null);
    const bottomRef = useRef<StackLayout>(null);
    const update = useUpdate();
    const {
      height = 64,
      borderRadius = 10,
      shift = 4,
      compensate = 0,
      backgroundColor = '#000a12',
      opacity = 1,
      padding = 8,
      activeTabColor = '#e91e63',
      tabColor = '#fff',
    } = bottomNavigationOptions || {};
    const contextValue = useMemo<TabNavigatorContextValue>(
      () => ({ descriptorsMap: {}, count: slot.length, activeTabColor, tabColor }),
      [],
    );
    const { descriptorsMap } = contextValue;

    useLayoutEffect(() => update(), []);

    const handleLayoutChange = useEvent(() => {
      const bottomNavigation = bottomRef.current;
      const size = layoutRef.current.getActualSize();

      setTimeout(() => {
        bottomNavigation.top = size.height - height - (shift + compensate);
        bottomNavigation.left = shift;
        bottomNavigation.width = size.width - 2 * shift;
        bottomNavigation.height = height;
        bottomNavigation.borderRadius = borderRadius;
      });
    });

    const handleTap = useEvent(() => {});

    const descriptorKeys = Object.keys(descriptorsMap);

    return (
      <TabNavigatorContext.Provider value={contextValue}>
        <absolute-layout ref={layoutRef} onLayoutChanged={handleLayoutChange}>
          <stack-layout width='100%' height='100%'>
            {descriptorKeys.length > 0 && (
              <StackNavigator.Root ref={navRef}>
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
          <flexbox-layout
            ref={bottomRef}
            backgroundColor={backgroundColor}
            opacity={opacity}
            justifyContent='space-between'
            alignItems='center'
            paddingLeft={padding}
            paddingRight={padding}
            onTap={handleTap}>
            {slot}
          </flexbox-layout>
        </absolute-layout>
      </TabNavigatorContext.Provider>
    );
  },
  { displayName: 'TabNavigator.Root' },
);

type TabScreenProps = {
  renderTab?: (name: string, isActive: boolean) => DarkElement;
} & StackScreenProps;

const Screen = component<TabScreenProps>(
  ({ name, component, renderTab = defaultRenderTab, slot }) => {
    const { push, pathname: currentPathname } = useNavigationContext();
    const { descriptorsMap, count, activeTabColor, tabColor } = useTabNavigatorContext();
    const { prefix } = useScreenNavigatorContext();
    const pathname = createPathname(name, prefix);
    const isActive = detectIsMatch(currentPathname, pathname);
    const width = 100 / count;

    const handleTap = useEvent(() => push(pathname, { animated: true }));

    descriptorsMap[name] = { name, component, slot };

    return (
      <stack-layout accessibilityRole={AccessibilityRole.Button} width={`${width}%`} onTap={handleTap}>
        <flexbox-layout
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          color={isActive ? activeTabColor : tabColor}>
          {renderTab(name, isActive)}
        </flexbox-layout>
      </stack-layout>
    );
  },
  {
    displayName: 'TabNavigator.Screen',
  },
);

const defaultRenderTab = (name: string) => <label>{name}</label>;

type TabDescriptor = Omit<TabScreenProps, 'renderTab'>;

type TabNavigatorContextValue = {
  descriptorsMap: Record<string, TabDescriptor>;
  count: number;
  activeTabColor: string;
  tabColor: string;
};

type BottomNavigationOptions = {
  height: number;
  borderRadius: number;
  shift: number;
  compensate: number;
  backgroundColor: string;
  opacity: number;
  padding: number;
  activeTabColor: string;
  tabColor: string;
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
