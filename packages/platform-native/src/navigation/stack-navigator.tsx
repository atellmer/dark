import {
  type AbsoluteLayout,
  type StackLayout,
  type EventData,
  type AnimationDefinition,
  Screen as DeviceScreen,
  Animation,
  CoreTypes,
} from '@nativescript/core';
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
  memo,
  useContext,
  useMemo,
  useState,
  useEffect,
  useEvent,
  useImperativeHandle,
  keyBy,
  error,
} from '@dark-engine/core';

import { type SyntheticEvent } from '../events';
import { useNavigationContext, type NavigationOptions } from './navigation-container';
import { SLASH, TransitionName } from './constants';
import { createPathname, detectIsMatch, getSegment } from './utils';
import { HistoryAction } from './navigation-history';

export type StackNavigatorProps = {
  slot: Array<ScreenComponent>;
  onNavigate?: (pathname: string, idx: number) => void;
};

export type StackNavigatorRef = {
  push: (pathname: string, options?: NavigationOptions) => void;
  replace: (pathname: string) => void;
  back: () => void;
  getPathnameByIdx: (idx: number) => string;
};

const Navigator = forwardRef<StackNavigatorProps, StackNavigatorRef>(
  createComponent(({ slot, onNavigate }, ref) => {
    const { pathname, push, replace, back, subscribe } = useNavigationContext();
    const { prefix } = useScreenNavigatorContext();
    const [transition, setTransition] = useState<Transition>(null);
    const scope = useMemo<Scope>(
      () => ({ transitionsQueue: [], backTransitionsStack: [], size: null, isBusy: false, refsMap: {}, pathname }),
      [],
    );
    const pathnames = slot.map(x => createPathname(x.props.name, prefix));

    scope.pathname = pathname;

    useEffect(() => {
      replace(pathnames[0]);

      const unsubscribe = subscribe((pathname, action, options) => {
        const isBack = action === HistoryAction.BACK;
        const isMatch = detectIsMatch({ prevPathname: scope.pathname, nextPathname: pathname, pathnames, prefix });
        const idx = pathnames.findIndex(x => x === pathname);

        isMatch && scheduleTransition(pathname, isBack, options);
        detectIsFunction(onNavigate) && onNavigate(pathname, idx);
      });

      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (!transition) return;
      let animation: Animation = null;

      if (transition.options.animated) {
        const targetFrom = matchRef(scope.refsMap, transition.from);
        const targetTo = matchRef(scope.refsMap, transition.to);

        if (!targetFrom || !targetTo) {
          throw new Error('[Dark]: Can not resolve ref for transition!');
        }

        if (!scope.size) {
          throw new Error('[Dark]: Can not find layout size for transition!');
        }

        animation = createAnimation({
          targetFrom,
          targetTo,
          size: scope.size,
          transition,
        });

        (async () => {
          try {
            await animation.play();
            scope.isBusy = false;
            executeTransitions();
          } catch (err) {
            error(err);
          }
        })();
      } else {
        scope.isBusy = false;
        executeTransitions();
      }

      return () => animation?.cancel();
    }, [transition]);

    useImperativeHandle(ref, () => ({
      push,
      replace,
      back,
      getPathnameByIdx: (idx: number) => pathnames[idx],
    }));

    const handleLayoutChanged = useEvent((e: SyntheticEvent<EventData, AbsoluteLayout>) => {
      console.log('loaded');
      scope.size = getMeasuredSizeInDPI(e.target);
    });

    const scheduleTransition = (to: string, isBack: boolean, options?: NavigationOptions) => {
      if (isBack) {
        const transition = scope.backTransitionsStack.pop();

        scope.transitionsQueue.push(transition);
      } else {
        const prevTransition = scope.transitionsQueue[scope.transitionsQueue.length - 1];
        const from = prevTransition?.to || transition?.to || scope.pathname;
        const nextTransition: Transition = {
          from,
          to,
          isBack: false,
          options: resolveNavigationOptions(options),
        };
        const backTransition: Transition = {
          ...nextTransition,
          isBack: true,
          from: nextTransition.to,
          to: nextTransition.from,
        };

        scope.transitionsQueue.push(nextTransition);
        scope.backTransitionsStack.push(backTransition);
      }

      executeTransitions();
    };

    const executeTransitions = () => {
      if (scope.isBusy) return;
      const nextTransition = scope.transitionsQueue.shift();

      if (!nextTransition) {
        scope.refsMap = {};

        return setTransition(null);
      }

      scope.isBusy = true;
      setTransition(nextTransition);
    };

    const rendered = useMemo(
      () => ({ items: getItems({ slot, transition, pathname, prefix }) }),
      [transition, pathname],
    );

    return (
      <absolute-layout width={FULL} height={FULL} onLayoutChanged={handleLayoutChanged}>
        {rendered.items.map((x, idx) => {
          const isHidden = idx === 1;
          const key = createPathname(x.props.name, prefix);
          const setRef = (ref: StackLayout) => {
            scope.refsMap[key] = ref;
          };

          return (
            <stack-layout
              ref={setRef}
              key={key}
              width={FULL}
              height={FULL}
              visibility={isHidden ? 'hidden' : 'visible'}>
              {x}
            </stack-layout>
          );
        })}
      </absolute-layout>
    );
  }),
);

export type StackScreenProps = {
  name: string;
  component?: Component;
  slot?: () => DarkElement;
};

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

const StackNavigator = {
  Root: memo(Navigator),
  Screen,
};

type Scope = {
  transitionsQueue: Array<Transition>;
  backTransitionsStack: Array<Transition>;
  isBusy: boolean;
  pathname: string;
  size: Size;
  refsMap: Record<string, StackLayout>;
};

type Size = {
  width: number;
  height: number;
};

type ScreenNavigatorContextValue = {
  prefix: string;
  parentPrefix: string;
};

const ScreenNavigatorContext = createContext<ScreenNavigatorContextValue>({ prefix: SLASH, parentPrefix: '' });

function useScreenNavigatorContext() {
  return useContext(ScreenNavigatorContext);
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

type Transition = {
  from: string;
  to: string;
  isBack: boolean;
  options: NavigationOptions;
};

type CreateAnimationOptions = {
  transition: Transition;
  targetFrom: StackLayout;
  targetTo: StackLayout;
  size: Size;
};

function createAnimation(options: CreateAnimationOptions) {
  const {
    transition: {
      options: { transition },
    },
  } = options;
  const map = {
    [TransitionName.FADE]: createFadeAnimation,
    [TransitionName.SLIDE]: createSlideAnimation,
  };

  return map[transition.name] ? map[transition.name](options) : null;
}

function createFadeAnimation(options: CreateAnimationOptions): Animation {
  const { transition, targetFrom, targetTo } = options;
  const { duration, curve } = transition.options.transition;
  const animations: Array<AnimationDefinition> = [
    {
      target: targetFrom,
      opacity: 0,
      duration,
      curve,
    },
    {
      target: targetTo,
      opacity: 1,
      duration,
      curve,
    },
  ];
  const animation = new Animation(animations);

  targetTo.opacity = 0;
  targetTo.visibility = 'visible';

  return animation;
}

function createSlideAnimation(options: CreateAnimationOptions): Animation {
  const { transition, targetFrom, targetTo, size } = options;
  const { duration, curve = CoreTypes.AnimationCurve.easeInOut } = transition.options.transition;
  const { isBack } = transition;
  const { width } = size;
  const animations: Array<AnimationDefinition> = [
    {
      target: targetFrom,
      translate: { x: isBack ? width : -1 * width, y: 0 },
      duration,
      curve,
    },
    {
      target: targetTo,
      translate: { x: 0, y: 0 },
      duration,
      curve,
    },
  ];
  const animation = new Animation(animations);

  targetTo.translateX = isBack ? -1 * width : width;
  targetTo.visibility = 'visible';

  return animation;
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

function matchRef(refsMap: Record<string, StackLayout>, pathname: string): StackLayout {
  for (const key of Object.keys(refsMap)) {
    if (pathname.indexOf(key) !== -1) {
      return refsMap[key];
    }
  }

  return null;
}

function getMeasuredSizeInDPI(view: AbsoluteLayout): Size {
  return {
    width: view.getMeasuredWidth() / SCALE_FACTOR,
    height: view.getMeasuredHeight() / SCALE_FACTOR,
  };
}

const SCALE_FACTOR = DeviceScreen.mainScreen.scale;
const FULL = '100%';
const DEFAULT_TRANSITION_DURATION = 100;

export { StackNavigator, useScreenNavigatorContext };
