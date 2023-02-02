import {
  type AbsoluteLayout,
  type StackLayout,
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
  useRef,
  useImperativeHandle,
  keyBy,
  error,
} from '@dark-engine/core';

import { useNavigationContext, type NavigationOptions } from './navigation-container';
import { SLASH, TransitionName } from './constants';
import { createPathname, detectIsMatch, getMatchedIdx, getSegment } from './utils';
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
    const { pathname, push, replace, back, subscribe, store } = useNavigationContext();
    const { prefix } = useScreenNavigatorContext();
    const [transition, setTransition] = useState<Transition>(null);
    const scope = useMemo<Scope>(() => ({ refsMap: {}, pathname }), []);
    const rootRef = useRef<AbsoluteLayout>(null);
    const names = slot.map(x => x.props.name);
    const pathnames = names.map(x => createPathname(x, prefix));
    const entry = pathnames[0];

    scope.pathname = pathname;

    useEffect(() => {
      const segment = getSegment(pathname, prefix);
      const canReplaceEntry = names.every(x => x !== segment);

      canReplaceEntry && replace(entry);
    }, []);

    useEffect(() => {
      const unsubscribe = subscribe((pathname, action, options) => {
        const isBack = action === HistoryAction.BACK;
        const isMatch = detectIsMatch({ prevPathname: scope.pathname, nextPathname: pathname, pathnames, prefix });
        const idx = getMatchedIdx(pathnames, pathname);

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
        const size = getMeasuredSizeInDPI(rootRef.current);

        if (!targetFrom || !targetTo) {
          throw new Error('[Dark]: Can not resolve ref for transition!');
        }

        animation = createAnimation({
          targetFrom,
          targetTo,
          transition,
          size,
        });

        (async () => {
          try {
            await animation.play();
            store.inTransition = false;
            executeTransitions();
          } catch (err) {
            error(err);
          }
        })();
      } else {
        store.inTransition = false;
        executeTransitions();
      }
    }, [transition]);

    useImperativeHandle(ref, () => ({
      push,
      replace,
      back,
      getPathnameByIdx: (idx: number) => pathnames[idx],
    }));

    const scheduleTransition = (to: string, isBack: boolean, options?: NavigationOptions) => {
      const { transitions } = store;

      if (isBack) {
        const transition = transitions.backward.pop();

        transitions.forward.push(transition);
      } else {
        const prevTransition = transitions.forward[transitions.forward.length - 1];
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

        transitions.forward.push(nextTransition);
        transitions.backward.push(backTransition);
      }

      executeTransitions();
    };

    const executeTransitions = () => {
      if (store.inTransition) return;
      const nextTransition = store.transitions.forward.shift();

      if (!nextTransition) {
        scope.refsMap = {};

        return setTransition(null);
      }

      store.inTransition = true;
      setTransition(nextTransition);
    };

    const rendered = useMemo(
      () => ({
        items: transition
          ? getTransitionItems({ transition, prefix, slot })
          : [getMatchedItem({ pathname, fallback: entry, prefix, slot })],
      }),
      [transition],
    );

    return (
      <absolute-layout ref={rootRef} width={FULL} height={FULL}>
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
  pathname: string;
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

type GetTransitionItems = {
  transition: Transition;
  prefix: string;
  slot: Array<ScreenComponent>;
};

function getTransitionItems(options: GetTransitionItems): Array<ScreenComponent> {
  const { transition, prefix, slot } = options;
  const slotsMap = keyBy(slot, x => x.props.name, true) as Record<string, ScreenComponent>;
  const segmentFrom = getSegment(transition.from, prefix);
  const segmentTo = getSegment(transition.to, prefix);
  const factoryFrom = slotsMap[segmentFrom];
  const factoryTo = slotsMap[segmentTo];
  const items = [factoryFrom, factoryTo].filter(Boolean) as [ScreenComponent, ScreenComponent];

  return items;
}

type GetMatchedItem = {
  pathname: string;
  fallback: string;
  prefix: string;
  slot: Array<ScreenComponent>;
};

function getMatchedItem(options: GetMatchedItem): ScreenComponent {
  const { pathname, fallback, prefix, slot } = options;
  const slotsMap = keyBy(slot, x => x.props.name, true) as Record<string, ScreenComponent>;
  const segment1 = getSegment(pathname, prefix);
  const segment2 = getSegment(fallback, prefix);
  const item = slotsMap[segment1] || slotsMap[segment2] || null;

  return item;
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
