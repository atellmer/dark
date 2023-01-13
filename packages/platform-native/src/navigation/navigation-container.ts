import { Frame, Page } from '@nativescript/core';
import {
  type DarkElement,
  createComponent,
  useRef,
  useEffect,
  useMemo,
  useState,
  useEvent,
  useContext,
  createContext,
} from '@dark-engine/core';

import { frame, page, stackLayout } from '../factory';
import { createNavigationHistory, NavigationHistory } from './navigation-history';
import { SLASH } from '../constants';

type NavigationContextValue = {
  pathname: string;
  navigateTo: (pathname: string) => void;
  goBack: () => void;
};

const NavigationContext = createContext<NavigationContextValue>(null);

function useNavigationContext() {
  const value = useContext(NavigationContext);

  return value;
}

function useNavigation() {
  return useNavigationContext();
}

type NavigationContaierProps = {
  slot: DarkElement;
};

const NavigationContaier = createComponent<NavigationContaierProps>(({ slot }) => {
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

  const navigateTo = useEvent((pathname: string) => scope.history.push(pathname));

  const goBack = useEvent(() => scope.history.back());

  const contextValue = useMemo<NavigationContextValue>(() => ({ pathname, navigateTo, goBack }), []);

  contextValue.pathname = pathname;

  return NavigationContext.Provider({
    value: contextValue,
    slot: frame({
      slot: page({
        slot: stackLayout({
          slot: [
            stackLayout({ slot }),
            stackLayout({
              hidden: true,
              slot: frame({
                ref: frameRef,
                slot: page({ ref: pageRef, actionBarHidden: true, slot: [] }),
              }),
            }),
          ],
        }),
      }),
    }),
  });
});

type Scope = {
  history: NavigationHistory;
};

export { NavigationContaier, useNavigation };
