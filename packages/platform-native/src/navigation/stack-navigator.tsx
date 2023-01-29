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
  slot: Array<ScreenComponent>;
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
      const [transition, setTransition] = useState<Transition>(null);
      const scope = useMemo<Scope>(() => ({ transitionsQueue: [], pathname }), []);
      const pathnames = slot.map(x => createPathname(x.props.name, prefix));

      scope.pathname = pathname;

      useEffect(() => {
        replace(pathnames[0]);

        const unsubscribe = subscribe((pathname, action) => {
          const isBack = action === HistoryAction.BACK;
          const isMatch = detectIsMatch({ prevPathname: scope.pathname, nextPathname: pathname, pathnames, prefix });

          isMatch && scheduleTransition(pathname, isBack);
        });

        return () => unsubscribe();
      }, []);

      const scheduleTransition = (to: string, isBack: boolean) => {
        const prevTransition = scope.transitionsQueue[scope.transitionsQueue.length - 1];
        const from = prevTransition?.to || transition?.to || scope.pathname;
        const nextTransition: Transition = { from, to, isBack, duration: 1000 };

        scope.transitionsQueue.push(nextTransition);
        executeTransition();
      };

      const executeTransition = (fromCheck = false) => {
        if (transition && !fromCheck) return;
        const nextTransition = scope.transitionsQueue.shift();
        if (!nextTransition) return setTransition(null);

        setTransition(nextTransition);
        setTimeout(() => {
          executeTransition(true);
        }, nextTransition.duration);
      };

      const rendered = useMemo(
        () => ({ items: getItems({ slot, transition, pathname, prefix }) }),
        [transition, pathname],
      );

      const colors = ['green', 'blue'];

      return (
        <absolute-layout width='100%' height='100%'>
          {rendered.items.map((x, idx) => {
            return (
              <stack-layout key={x.props.name} width='100%' height='100%' backgroundColor={colors[idx]}>
                {x}
              </stack-layout>
            );
          })}
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
  duration: number;
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

type DetectIsMatchOptions = {
  prevPathname: string;
  nextPathname: string;
  pathnames: Array<string>;
  prefix: string;
};

function detectIsMatch(options: DetectIsMatchOptions) {
  const { prevPathname, nextPathname, pathnames, prefix } = options;
  const hasSameRoute = pathnames.some(x => nextPathname.indexOf(x) !== -1);
  const nextSegment = getSegment(nextPathname, prefix);
  const prevSegment = getSegment(prevPathname, prefix);
  const isMatch = hasSameRoute && nextSegment !== prevSegment;

  return isMatch;
}

function getSegment(pathname: string, prefix: string) {
  const [segment] = pathname.replace(prefix, '').split(SLASH).filter(Boolean);

  return segment;
}

type GetItemsOptions = {
  transition: Transition;
  pathname: string;
  prefix: string;
  slot: Array<ScreenComponent>;
};

function getItems(options: GetItemsOptions): Array<ScreenComponent> {
  const { slot, transition, pathname, prefix } = options;
  const slotsMap = keyBy(slot, x => x.props.name, true) as Record<string, ScreenComponent>;
  const segmentFrom = transition ? getSegment(transition.from, prefix) : null;
  const segmentTo = getSegment(transition ? transition.to : pathname, prefix);
  const factoryFrom = slotsMap[segmentFrom] || null;
  const factoryTo = slotsMap[segmentTo] || null;
  const items = [factoryFrom, factoryTo].filter(Boolean);

  return items;
}

type ScreenComponent = ComponentFactory<StackScreenProps & StandardComponentProps>;

export { createStackNavigator };
