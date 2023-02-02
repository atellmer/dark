import { Frame, Page } from '@nativescript/core';
import {
  type DarkElement,
  h,
  createComponent,
  useRef,
  useEffect,
  useMemo,
  useState,
  useEvent,
  useContext,
  createContext,
} from '@dark-engine/core';

import { createNavigationHistory, NavigationHistory, type HistorySubscriber } from './navigation-history';
import { SLASH, TransitionName } from './constants';

type NavigationContainerProps = {
  slot: DarkElement;
};

const NavigationContainer = createComponent<NavigationContainerProps>(({ slot }) => {
  const frameRef = useRef<Frame>(null);
  const pageRef = useRef<Page>(null);
  const scope = useMemo<Scope>(
    () => ({ history: null, store: { inTransition: false, transitions: { forward: [], backward: [] } } }),
    [],
  );
  const [pathname, setPathname] = useState(SLASH);

  useEffect(() => {
    const history = createNavigationHistory(frameRef.current, pageRef.current);
    const unsubscribe = history.subscribe(pathname => setPathname(pathname));

    scope.history = history;

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  const push = useEvent((pathname: string, options?: NavigationOptions) => scope.history.push(pathname, options));

  const replace = useEvent((pathname: string) => scope.history.replace(pathname));

  const back = useEvent(() => scope.history.back());

  const subscribe = useEvent((subscriber: HistorySubscriber) => scope.history.subscribe(subscriber));

  const contextValue = useMemo<NavigationContextValue>(
    () => ({ pathname, push, replace, back, subscribe, store: scope.store }),
    [pathname],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      <frame>
        <page>
          <action-bar title='navigation'></action-bar> {/*TODO*/}
          <stack-layout>
            <frame ref={frameRef} hidden>
              <page ref={pageRef} actionBarHidden />
            </frame>
            {slot}
          </stack-layout>
        </page>
      </frame>
    </NavigationContext.Provider>
  );
});

type Scope = {
  history: NavigationHistory;
  store: Store;
};

type Store = {
  inTransition: boolean;
  transitions: {
    forward: Array<Transition>;
    backward: Array<Transition>;
  };
};

type Transition = {
  from: string;
  to: string;
  isBack: boolean;
  options: NavigationOptions;
};

export type NavigationOptions = {
  animated?: boolean;
  transition?: AnimatedTransition;
};

type AnimatedTransition = {
  name?: TransitionName;
  duration?: number;
  curve?: string;
};

type NavigationContextValue = {
  pathname: string;
  push: (pathname: string, options?: NavigationOptions) => void;
  replace: (pathname: string) => void;
  back: () => void;
  subscribe: (subscriber: HistorySubscriber) => () => void;
  store: Store;
};

const NavigationContext = createContext<NavigationContextValue>(null);

function useNavigationContext() {
  const value = useContext(NavigationContext);

  return value;
}

export { NavigationContainer, useNavigationContext };
