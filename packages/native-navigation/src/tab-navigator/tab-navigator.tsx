import { AccessibilityRole } from '@nativescript/core';
import {
  type DarkElement,
  type Component,
  type StandardComponentProps,
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
  type AbsoluteLayoutRef,
  type StackLayoutRef,
  AbsoluteLayout,
  StackLayout,
  FlexboxLayout,
} from '@dark-engine/platform-native';

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
    const layoutRef = useRef<AbsoluteLayoutRef>(null);
    const bottomRef = useRef<StackLayoutRef>(null);
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
      animated = false,
    } = bottomNavigationOptions || {};
    const contextValue = useMemo<TabNavigatorContextValue>(
      () => ({ descriptorsMap: {}, count: slot.length, activeTabColor, tabColor, animated }),
      [],
    );
    const { descriptorsMap } = contextValue;
    const descriptorKeys = Object.keys(descriptorsMap);

    useLayoutEffect(() => update(), []);

    const handleLayoutChange = useEvent(() => {
      const nav = bottomRef.current;
      const size = layoutRef.current.getActualSize();

      requestAnimationFrame(() => {
        nav.top = size.height - height - (shift + compensate);
        nav.left = shift;
        nav.width = size.width - 2 * shift;
        nav.height = height;
        nav.borderRadius = borderRadius;
      });
    });

    return (
      <TabNavigatorContext.Provider value={contextValue}>
        <AbsoluteLayout ref={layoutRef} onLayoutChanged={handleLayoutChange}>
          <StackLayout width='100%' height='100%'>
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
          </StackLayout>
          <FlexboxLayout
            ref={bottomRef}
            backgroundColor={backgroundColor}
            opacity={opacity}
            justifyContent='space-between'
            alignItems='center'
            paddingLeft={padding}
            paddingRight={padding}>
            {slot}
          </FlexboxLayout>
        </AbsoluteLayout>
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
    const { descriptorsMap, count, activeTabColor, tabColor, animated } = useTabNavigatorContext();
    const { prefix } = useScreenNavigatorContext();
    const pathname = createPathname(name, prefix);
    const isActive = detectIsMatch(currentPathname, pathname);
    const width = 100 / count;
    const handleTap = useEvent(() => push(pathname, { animated }));

    descriptorsMap[name] = { name, component, slot };

    return (
      <StackLayout accessibilityRole={AccessibilityRole.Button} width={`${width}%`} onTap={handleTap}>
        <FlexboxLayout
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          color={isActive ? activeTabColor : tabColor}>
          {renderTab(name, isActive)}
        </FlexboxLayout>
      </StackLayout>
    );
  },
  {
    displayName: 'TabNavigator.Screen',
  },
);

const defaultRenderTab = (name: string) => <label>{name}</label>;

type TabDescriptor = Omit<TabScreenProps, 'renderTab'>;

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
  animated: boolean;
};

type TabNavigatorContextValue = {
  descriptorsMap: Record<string, TabDescriptor>;
  count: number;
} & Pick<BottomNavigationOptions, 'activeTabColor' | 'tabColor' | 'animated'>;

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
