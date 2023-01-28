import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  type DarkElement,
  h,
  Fragment,
  createComponent,
  createContext,
  detectIsFunction,
  forwardRef,
  useContext,
  useMemo,
  memo,
  useState,
  useEffect,
  keyBy,
} from '@dark-engine/core';

import { useNavigationContext } from './navigation-container';
import { SLASH } from '../constants';
import { createPathname } from './utils';

export type StackNavigatorProps = {
  slot: Array<ComponentFactory<StackScreenProps & StandardComponentProps>>;
};

export type StackScreenProps = {
  name: string;
  component?: Component;
  slot?: () => DarkElement;
};

function createStackNavigator() {
  const Navigator = forwardRef<StackNavigatorProps, {}>(
    createComponent(({ slot }, _) => {
      const { pathname, replace } = useNavigationContext();
      const { prefix } = useScreenNavigatorContext();
      const [currentTransition, setCurrentTransition] = useState<Transition>(null);
      const scope = useMemo<Scope>(() => ({ transitionsQueue: [] }), []);
      const pathnames = slot.map(x => createPathname(x.props.name, prefix));
      const slotsMap = keyBy(slot, x => createPathname(x.props.name, prefix), true);

      useEffect(() => {
        replace(pathnames[0]);
      }, []);

      useEffect(() => {
        const isMatch = pathnames.some(x => pathname.indexOf(x) !== -1);
        if (!isMatch) return;
        const prevTransition = scope.transitionsQueue[scope.transitionsQueue.length - 1];
        const transition: Transition = {
          from: prevTransition?.to || currentTransition?.to || null,
          to: pathname,
        };

        scope.transitionsQueue.push(transition);
        executeTransition();
      }, [pathname]);

      const executeTransition = () => {
        if (currentTransition) return;
        const transition = scope.transitionsQueue.shift();

        setCurrentTransition(transition);
      };

      console.log('currentTransition', currentTransition);

      return (
        <>
          <action-bar title='navigation'></action-bar>
          <absolute-layout width='100%' height='100%'>
            {slot}
          </absolute-layout>
        </>
      );
    }),
  );

  const Screen = createComponent<StackScreenProps>(({ name, component, slot }) => {
    const { prefix } = useScreenNavigatorContext();
    const pathname = createPathname(name, prefix);
    const contextValue = useMemo(() => ({ prefix: pathname, parentPrefix: prefix }), []);

    return (
      <ScreenNavigatorContext.Provider value={contextValue}>
        {detectIsFunction(slot) ? slot() : component()}
      </ScreenNavigatorContext.Provider>
    );
  });

  return {
    Navigator: memo(Navigator),
    Screen,
  };
}

type Transition = {
  from: string;
  to: string;
};

type Scope = {
  transitionsQueue: Array<Transition>;
};

type ScreenNavigatorContextValue = {
  prefix: string;
  parentPrefix: string;
};

const ScreenNavigatorContext = createContext<ScreenNavigatorContextValue>({ prefix: SLASH, parentPrefix: '' });

function useScreenNavigatorContext() {
  return useContext(ScreenNavigatorContext);
}

export { createStackNavigator };
