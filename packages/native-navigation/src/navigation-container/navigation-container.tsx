import { CoreTypes } from '@nativescript/core';
import {
  type DarkElement,
  type Ref,
  component,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useEvent,
  useContext,
  useImperativeHandle,
  createContext,
  detectIsFunction,
} from '@dark-engine/core';
import { type FrameRef, type PageRef, Frame, Page } from '@dark-engine/platform-native';

import {
  type HistorySubscriber,
  type ParamsMap,
  type ParamsObject,
  createNavigationHistory,
  NavigationHistory,
  HistoryAction,
} from '../history';
import { SLASH_MARK, TransitionName } from '../constants';
import { normalizePathname } from '../utils';

type NavigationContainerProps = {
  ref?: Ref<NavigationContainerRef>;
  slot: DarkElement;
  defaultPathname: string;
  renderActionBar?: (options: RenderActionBarOptions) => DarkElement;
  onNavigate?: (pathname: string) => void;
};

export type NavigationContainerRef = {
  navigateTo: Push;
  goBack: Back;
};

export type RenderActionBarOptions = {
  pathname: string;
  goBack: () => void;
};

const NavigationContainer = component<NavigationContainerProps>(
  ({ slot, ref, defaultPathname = SLASH_MARK, renderActionBar, onNavigate }) => {
    const frameRef = useRef<FrameRef>(null);
    const pageRef = useRef<PageRef>(null);
    const [pathname, setPathname] = useState(normalizePathname(defaultPathname));
    const [transition, setTransition] = useState<Transition>(null);
    const scope = useMemo<Scope>(
      () => ({ history: null, inTransition: false, transitions: { forward: [], backward: [] } }),
      [],
    );
    const {
      transitions: { forward, backward },
    } = scope;

    useLayoutEffect(() => {
      const history = createNavigationHistory(pathname, frameRef.current, pageRef.current);
      const unsubscribe = history.subscribe((pathname, action, options) => {
        const isReplace = action === HistoryAction.REPLACE;
        const isBack = action === HistoryAction.BACK;

        setPathname(pathname);
        !isReplace && scheduleTransition(pathname, isBack, options);
        detectIsFunction(onNavigate) && onNavigate(pathname);
      });

      scope.history = history;

      return () => {
        unsubscribe();
        history.dispose();
      };
    }, []);

    useEffect(() => {
      if (!transition) return;
      const timeout = transition.options.animated ? transition.options.transition.duration : 0;
      const timerId = setTimeout(() => {
        scope.inTransition = false;
        executeTransitions();
      }, timeout + WAITING_TIMEOUT);

      return () => clearTimeout(timerId);
    }, [transition]);

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

    const push = useEvent((pathname: string, options?: NavigationOptions) => scope.history.push(pathname, options));

    const replace = useEvent((pathname: string) => scope.history.replace(pathname));

    const back = useEvent(() => scope.history.back());

    const getParams = useEvent((pathname: string) => (scope.history ? scope.history.getParams(pathname) : null));

    const subscribe = useEvent((subscriber: HistorySubscriber) => scope.history.subscribe(subscriber));

    const contextValue = useMemo<NavigationContextValue>(
      () => ({ pathname, transition, push, replace, back, getParams, subscribe }),
      [pathname, transition],
    );

    useImperativeHandle(ref, () => ({ navigateTo: push, goBack: back }), []);

    const hasActionBar = detectIsFunction(renderActionBar);

    return (
      <NavigationContext.Provider value={contextValue}>
        <Frame>
          <Page actionBarHidden={!hasActionBar}>
            {hasActionBar && renderActionBar({ pathname, goBack: back })}
            {slot}
          </Page>
        </Frame>
        <Frame ref={frameRef} hidden>
          <Page ref={pageRef} actionBarHidden />
        </Frame>
      </NavigationContext.Provider>
    );
  },
  { displayName: 'NavigationContainer' },
);

type Scope = {
  history: NavigationHistory;
  inTransition: boolean;
  transitions: {
    forward: Array<Transition>;
    backward: Array<Transition>;
  };
};

export type Transition = {
  from: string;
  to: string;
  isBack: boolean;
  options: NavigationOptions;
};

export type NavigationOptions = {
  animated?: boolean;
  transition?: AnimatedTransition;
  params?: ParamsObject;
};

type AnimatedTransition = {
  name?: TransitionName;
  duration?: number;
  curve?: string;
};

export type Push = (pathname: string, options?: NavigationOptions) => void;

export type Replace = (pathname: string) => void;

export type Back = () => void;

type NavigationContextValue = {
  transition: Transition | null;
  pathname: string;
  push: Push;
  replace: Replace;
  back: Back;
  getParams: (pathname: string) => ParamsMap;
  subscribe: (subscriber: HistorySubscriber) => () => void;
};

const NavigationContext = createContext<NavigationContextValue>(null);

function useNavigationContext() {
  const value = useContext(NavigationContext);

  return value;
}

function resolveNavigationOptions(nextOptions: NavigationOptions): NavigationOptions {
  const animated = nextOptions?.animated || false;
  const name = nextOptions?.transition?.name || TransitionName.slide;
  const duration = nextOptions?.transition?.duration || DEFAULT_TRANSITION_DURATION;
  const curve = nextOptions?.transition?.curve || CoreTypes.AnimationCurve.easeInOut;
  const options: NavigationOptions = {
    animated,
    transition: { name, duration, curve },
    params: nextOptions.params,
  };

  return options;
}

const DEFAULT_TRANSITION_DURATION = 150;
const WAITING_TIMEOUT = 100;

export { NavigationContainer, useNavigationContext };
