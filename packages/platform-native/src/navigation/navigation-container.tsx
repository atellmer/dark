import { Frame, Page, CoreTypes } from '@nativescript/core';
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

import {
  type HistorySubscriber,
  createNavigationHistory,
  NavigationHistory,
  HistoryAction,
} from './navigation-history';
import { SLASH, TransitionName } from './constants';

type NavigationContainerProps = {
  slot: DarkElement;
};

const NavigationContainer = createComponent<NavigationContainerProps>(({ slot }) => {
  const frameRef = useRef<Frame>(null);
  const pageRef = useRef<Page>(null);
  const [pathname, setPathname] = useState(SLASH);
  const scope = useMemo<Scope>(
    () => ({ history: null, pathname, inTransition: false, transitions: { forward: [], backward: [] } }),
    [],
  );
  const [transition, setTransition] = useState<Transition>(null);
  const {
    transitions: { forward, backward },
  } = scope;

  scope.pathname = pathname;

  useEffect(() => {
    const history = createNavigationHistory(frameRef.current, pageRef.current);
    const unsubscribe = history.subscribe((pathname, action, options) => {
      const isReplace = action === HistoryAction.REPLACE;
      const isBack = action === HistoryAction.BACK;

      !isReplace && scheduleTransition(pathname, isBack, options);
      setPathname(pathname);
    });

    scope.history = history;

    return () => {
      unsubscribe();
      history.dispose();
    };
  }, []);

  const scheduleTransition = (to: string, isBack: boolean, options?: NavigationOptions) => {
    if (isBack) {
      const transition = backward.pop();

      forward.push(transition);
    } else {
      const from = scope.history.getBack();
      const forwardTransition: Transition = {
        from,
        to,
        isBack: false,
        options: resolveNavigationOptions(options),
      };
      const backwardTransition: Transition = {
        ...forwardTransition,
        isBack: true,
        from: forwardTransition.to,
        to: forwardTransition.from,
      };

      forward.push(forwardTransition);
      backward.push(backwardTransition);
    }

    executeTransitions();
  };

  const executeTransitions = () => {
    if (scope.inTransition) return;
    const transition = forward.shift();
    if (!transition) return setTransition(null);

    scope.inTransition = true;
    setTransition(transition);
  };

  const handleCompleteTransition = () => {
    scope.inTransition = false;
    executeTransitions();
  };

  const push = useEvent((pathname: string, options?: NavigationOptions) => scope.history.push(pathname, options));

  const replace = useEvent((pathname: string) => scope.history.replace(pathname));

  const back = useEvent(() => scope.history.back());

  const subscribe = useEvent((subscriber: HistorySubscriber) => scope.history.subscribe(subscriber));

  const contextValue = useMemo<NavigationContextValue>(
    () => ({ pathname, transition, push, replace, back, subscribe, onCompleteTransition: handleCompleteTransition }),
    [pathname, transition],
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
  pathname: string;
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
  transition: Transition | null;
  pathname: string;
  push: (pathname: string, options?: NavigationOptions) => void;
  replace: (pathname: string) => void;
  back: () => void;
  subscribe: (subscriber: HistorySubscriber) => () => void;
  onCompleteTransition: () => void;
};

const NavigationContext = createContext<NavigationContextValue>(null);

function useNavigationContext() {
  const value = useContext(NavigationContext);

  return value;
}

function resolveNavigationOptions(nextOptions: NavigationOptions): NavigationOptions {
  const animated = nextOptions?.animated || false;
  const name = nextOptions?.transition?.name || TransitionName.SLIDE;
  const duration = nextOptions?.transition?.duration || DEFAULT_TRANSITION_DURATION;
  const curve = nextOptions?.transition?.curve || CoreTypes.AnimationCurve.easeInOut;
  const options: NavigationOptions = {
    animated,
    transition: { name, duration, curve },
  };

  return options;
}

const DEFAULT_TRANSITION_DURATION = 100;

export { NavigationContainer, useNavigationContext };
