import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  type DarkElement,
  h,
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
import { HistoryAction } from './navigation-history';

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
      const { pathname, replace, subscribe } = useNavigationContext();
      const { prefix } = useScreenNavigatorContext();
      const [currentTransition, setCurrentTransition] = useState<Transition>(null);
      const scope = useMemo<Scope>(() => ({ transitionsQueue: [], pathname }), []);
      const pathnames = slot.map(x => createPathname(x.props.name, prefix));
      const slotsMap = keyBy(slot, x => createPathname(x.props.name, prefix), true);

      scope.pathname = pathname;

      useEffect(() => {
        replace(pathnames[0]);

        const unsubscribe = subscribe((pathname, action) => {
          const isBack = action === HistoryAction.BACK;
          const isMatch = detectIsMatch(pathname, pathnames);

          isMatch && scheduleTransition(pathname, isBack);
        });

        return () => unsubscribe();
      }, []);

      const scheduleTransition = (to: string, isBack: boolean) => {
        const prevTransition = scope.transitionsQueue[scope.transitionsQueue.length - 1];
        const from = prevTransition?.to || currentTransition?.to || scope.pathname;
        const transition: Transition = { from, to, isBack };

        scope.transitionsQueue.push(transition);
        executeTransition();
      };

      const executeTransition = () => {
        if (currentTransition) return;
        const transition = scope.transitionsQueue.shift();

        setCurrentTransition(transition);
      };

      console.log('currentTransition', currentTransition);

      return (
        <absolute-layout width='100%' height='100%'>
          {slot}
        </absolute-layout>
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
  isBack: boolean;
  duration?: number;
};

type Scope = {
  transitionsQueue: Array<Transition>;
  pathname: string;
};

type ScreenNavigatorContextValue = {
  prefix: string;
  parentPrefix: string;
};

const ScreenNavigatorContext = createContext<ScreenNavigatorContextValue>({ prefix: SLASH, parentPrefix: '' });

function useScreenNavigatorContext() {
  return useContext(ScreenNavigatorContext);
}

function detectIsMatch(pathname: string, pathnames: Array<string>) {
  const isMatch = pathnames.some(x => pathname.indexOf(x) !== -1);

  return isMatch;
}

export { createStackNavigator };
