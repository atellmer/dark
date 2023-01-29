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
  useRef,
  keyBy,
  error,
} from '@dark-engine/core';

import { type SyntheticEvent } from '../events';
import { useNavigationContext } from './navigation-container';
import { SLASH } from './constants';
import { createPathname, detectIsMatch, getSegment } from './utils';
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
      const scope = useMemo<Scope>(() => ({ transitionsQueue: [], size: null, pathname }), []);
      const pathnames = slot.map(x => createPathname(x.props.name, prefix));
      const rootRef = useRef<AbsoluteLayout>(null);
      const layoutFromRef = useRef<StackLayout>(null);
      const layoutToRef = useRef<StackLayout>(null);

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

      useEffect(() => {
        if (!transition) return;
        let animation: Animation = null;

        (async () => {
          animation = createAnimation({
            targetFrom: layoutFromRef.current,
            targetTo: layoutToRef.current,
            size: scope.size,
            transition,
          });

          try {
            await animation.play();
            executeTransition(true);
          } catch (err) {
            error(err);
          }
        })();

        return () => animation?.cancel();
      }, [transition]);

      const handleLayoutChanged = useEvent((e: SyntheticEvent<EventData, AbsoluteLayout>) => {
        const { target } = e;
        const scale = DeviceScreen.mainScreen.scale;
        const width = target.getMeasuredWidth() / scale;
        const height = target.getMeasuredHeight() / scale;

        scope.size = { width, height };
      });

      const scheduleTransition = (to: string, isBack: boolean) => {
        const prevTransition = scope.transitionsQueue[scope.transitionsQueue.length - 1];
        const from = prevTransition?.to || transition?.to || scope.pathname;
        const nextTransition: Transition = {
          from,
          to,
          isBack,
          duration: DEFAULT_TRANSITION_DURATION,
          type: AnimationType.SLIDE,
        };

        scope.transitionsQueue.push(nextTransition);
        executeTransition();
      };

      const executeTransition = (force = false) => {
        if (transition && !force) return;
        const nextTransition = scope.transitionsQueue.shift();

        if (!nextTransition) {
          layoutFromRef.current = null;
          layoutToRef.current = null;

          return setTransition(null);
        }

        setTransition(nextTransition);
      };

      const rendered = useMemo(
        () => ({ items: getItems({ slot, transition, pathname, prefix }) }),
        [transition, pathname],
      );

      return (
        <absolute-layout ref={rootRef} width={FULL} height={FULL} onLayoutChanged={handleLayoutChanged}>
          {rendered.items.map((x, idx) => {
            const isHidden = idx === 1;

            return (
              <stack-layout
                ref={idx === 0 ? layoutFromRef : layoutToRef}
                key={x.props.name}
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

type Scope = {
  transitionsQueue: Array<Transition>;
  pathname: string;
  size: Size;
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
  duration: number;
  type: AnimationType;
};

enum AnimationType {
  SLIDE = 'SLIDE',
  FADE = 'FADE',
}

type CreateAnimationOptions = {
  transition: Transition;
  targetFrom: StackLayout;
  targetTo: StackLayout;
  size: Size;
};

function createAnimation(options: CreateAnimationOptions) {
  const { transition } = options;
  const map = {
    [AnimationType.FADE]: createFadeAnimation,
    [AnimationType.SLIDE]: createSlideAnimation,
  };

  return map[transition.type] ? map[transition.type](options) : null;
}

function createFadeAnimation(options: CreateAnimationOptions): Animation {
  const { transition, targetFrom, targetTo } = options;
  const { duration } = transition;
  const curve = CoreTypes.AnimationCurve.easeInOut;
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
  const { duration, isBack } = transition;
  const { width } = size;
  const curve = CoreTypes.AnimationCurve.easeInOut;
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

const FULL = '100%';
const DEFAULT_TRANSITION_DURATION = 200;

export { createStackNavigator };
