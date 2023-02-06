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
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
} from '@dark-engine/core';

import { SLASH, TransitionName } from '../constants';
import { createPathname, getMatchedIdx, getSegments } from '../utils';
import { useNavigationContext, type Transition } from '../navigation-container';
import { type ParamsObject } from '../history';

export type StackNavigatorProps = {
  slot: Array<ScreenComponent>;
  onNavigate?: (pathname: string, idx: number) => void;
};

export type StackNavigatorRef = {
  getPathnameByIdx: (idx: number) => string;
};

const Navigator = forwardRef<StackNavigatorProps, StackNavigatorRef>(
  createComponent(({ slot, onNavigate }, ref) => {
    const { pathname, transition, replace, subscribe } = useNavigationContext();
    const { prefix } = useScreenNavigatorContext();
    const rootRef = useRef<AbsoluteLayout>(null);
    const names = slot.map(x => x.props.name);
    const pathnames = names.map(x => createPathname(x, prefix));
    const canStartTransition = detectCanStartTransition(transition, pathnames, prefix);
    const scope = useMemo<Scope>(() => ({ refsMap: {} }), []);
    const entry = pathnames[0];

    useLayoutEffect(() => {
      detectCanReplacePathname(pathname, entry, prefix) && replace(entry);
    }, [pathname]);

    useEffect(() => {
      const unsubscribe = subscribe(pathname => {
        if (detectIsFunction(onNavigate)) {
          const idx = getMatchedIdx(pathnames, pathname);

          onNavigate(pathname, idx);
        }
      });

      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (!canStartTransition || !transition.options.animated) return;
      const targetFrom = matchRef(scope.refsMap, transition.from);
      const targetTo = matchRef(scope.refsMap, transition.to);
      const size = getMeasuredSizeInDPI(rootRef.current);
      const animation = createAnimation({
        targetFrom,
        targetTo,
        transition,
        size,
      });

      animation.play().then(() => {
        targetFrom.opacity = 1;
        targetFrom.translateX = 0;
        targetFrom.hidden = true;

        targetTo.opacity = 1;
        targetTo.translateX = 0;
        targetTo.hidden = false;
      });
    }, [transition]);

    useImperativeHandle(ref, () => ({
      getPathnameByIdx: (idx: number) => pathnames[idx],
    }));

    const [segment] = canStartTransition ? getSegments(transition.from, prefix) : getSegments(pathname, prefix);
    const isAnyMatch = names.some(x => x === segment);

    return (
      <absolute-layout ref={rootRef} width={FULL} height={FULL}>
        {slot.map((x, idx) => {
          const name = x.props.name;
          const key = createPathname(name, prefix);
          const isHidden = isAnyMatch
            ? name !== segment
            : scope.refsMap[key]
            ? Boolean(scope.refsMap[key].hidden)
            : idx > 0;
          const setRef = (ref: StackLayout) => {
            scope.refsMap[key] = ref;
          };

          return (
            <stack-layout ref={setRef} key={key} width={FULL} height={FULL} hidden={isHidden}>
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
  initialParams?: ParamsObject;
  slot?: () => DarkElement;
};

const Screen = createComponent<StackScreenProps>(
  ({ name, component, initialParams, slot }) => {
    const { prefix } = useScreenNavigatorContext();
    const pathname = createPathname(name, prefix);
    const contextValue = useMemo<ScreenNavigatorContextValue>(
      () => ({ prefix: pathname, parentPrefix: prefix, initialParams }),
      [],
    );

    return (
      <ScreenNavigatorContext.Provider value={contextValue}>
        {detectIsFunction(slot) ? slot() : component()}
      </ScreenNavigatorContext.Provider>
    );
  },
  {
    defaultProps: {
      initialParams: {},
    },
  },
);

const StackNavigator = {
  Root: memo(Navigator),
  Screen,
};

type Scope = {
  refsMap: Record<string, SyntheticStackLayout>;
};

type Size = {
  width: number;
  height: number;
};

type ScreenNavigatorContextValue = {
  prefix: string;
  parentPrefix: string;
  initialParams: ParamsObject;
};

const ScreenNavigatorContext = createContext<ScreenNavigatorContextValue>({
  prefix: SLASH,
  parentPrefix: '',
  initialParams: {},
});

function useScreenNavigatorContext() {
  return useContext(ScreenNavigatorContext);
}

function detectCanReplacePathname(pathname: string, entry: string, prefix: string) {
  const segments1 = getSegments(pathname, prefix);
  const segments2 = getSegments(entry, prefix);
  const canReplace = segments1.length < segments2.length;

  return canReplace;
}

function detectCanStartTransition(transition: Transition, pathnames: Array<string>, prefix: string) {
  if (!transition) return false;
  const { from, to } = transition;
  const [segment1] = getSegments(from, prefix);
  const [segment2] = getSegments(to, prefix);
  const segments = pathnames.map(x => getSegments(x, prefix)[0]);
  const canStart = segment1 !== segment2 && segments.includes(segment1) && segments.includes(segment2);

  return canStart;
}

type ScreenComponent = ComponentFactory<StackScreenProps & StandardComponentProps>;

type CreateAnimationOptions = {
  transition: Transition;
  targetFrom: StackLayout;
  targetTo: SyntheticStackLayout;
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
  targetTo.hidden = false;

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
  targetTo.hidden = false;

  return animation;
}

function matchRef(refsMap: Record<string, SyntheticStackLayout>, pathname: string): SyntheticStackLayout {
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

type SyntheticStackLayout = {
  hidden?: boolean;
} & StackLayout;

const SCALE_FACTOR = DeviceScreen.mainScreen.scale;
const FULL = '100%';

export { StackNavigator, useScreenNavigatorContext };
