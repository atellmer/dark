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
  const scope = useMemo<Scope>(() => ({ history: null }), []);
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
    () => ({ pathname, push, replace, back, subscribe }),
    [pathname],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      <frame>
        <page>
          <action-bar title='navigation'></action-bar>
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
};

type NavigationContextValue = {
  pathname: string;
  push: (pathname: string, options?: NavigationOptions) => void;
  replace: (pathname: string) => void;
  back: () => void;
  subscribe: (subscriber: HistorySubscriber) => () => void;
};

const NavigationContext = createContext<NavigationContextValue>(null);

function useNavigationContext() {
  const value = useContext(NavigationContext);

  return value;
}

function useNavigation() {
  return useNavigationContext();
}

export type NavigationOptions = {
  animated?: boolean;
  transition?: AnimatedTransition;
};

type AnimatedTransition = {
  name?: TransitionName;
  duration?: number;
  curve?: string;
};

export { NavigationContainer, useNavigationContext, useNavigation };
