import { CoreTypes, type NavigationTransition, type Page, type Frame } from '@nativescript/core';
import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  type DarkElement,
  createComponent,
  createContext,
  useRef,
  useState,
  useEvent,
  useImperativeHandle,
  detectIsFunction,
  forwardRef,
  useLayoutEffect,
  useContext,
  useMemo,
  memo,
} from '@dark-engine/core';

import { ActionBar } from './action-bar';
import { frame, page } from '../factory';
import { SLASH } from '../constants';

const refsMap: Record<string, Page> = {};

export type StackNavigatorProps = {
  slot: Array<ComponentFactory<StackScreenProps & StandardComponentProps>>;
  onNavigate?: (name: string, idx: number) => void;
};

export type StackNavigatorRef = {
  getPathnameByIdx: (idx: number) => string;
} & Pick<StackNavigatorContextValue, 'navigateTo' | 'goBack'>;

export type StackScreenProps = {
  name: string;
  component?: Component;
  options?: StackScreenOptions;
  slot?: () => DarkElement;
  renderActionBar?: () => typeof ActionBar;
};

export type StackScreenOptions = {
  title?: string;
  headerShown?: boolean;
};

type StackNavigatorContextValue = {
  pathname: string;
  setPathname: (pathname: string) => void;
  navigateTo: (pathname: string, options?: NavigateToOptions) => void;
  goBack: () => void;
};
export type NavigateToOptions = {
  animated?: boolean;
  transition?: NavigationTransition;
};

const StackNavigatorContext = createContext<StackNavigatorContextValue>({
  pathname: '',
  setPathname: () => {},
  navigateTo: () => {},
  goBack: () => {},
});

function useStackNavigatorContext() {
  const value = useContext(StackNavigatorContext);

  return value;
}

type ScreenNavigatorContextValue = {
  prefix: string;
  parentPrefix: string;
};

const ScreenNavigatorContext = createContext<ScreenNavigatorContextValue>({ prefix: SLASH, parentPrefix: '' });

function useScreenNavigatorContext() {
  return useContext(ScreenNavigatorContext);
}

function useNavigation() {
  const { navigateTo, goBack, pathname } = useStackNavigatorContext();
  const { parentPrefix: prefix } = useScreenNavigatorContext();

  return {
    navigateTo,
    goBack,
    prefix,
    pathname,
  };
}

function createStackNavigator() {
  const Navigator = forwardRef<StackNavigatorProps, StackNavigatorRef>(
    createComponent(({ slot, onNavigate }, ref) => {
      const { prefix } = useScreenNavigatorContext();
      const names: Array<string> = useMemo(() => slot.map(x => x.props.name), []);
      const pathnames: Array<string> = useMemo(() => names.map(x => createPathname(x, prefix)), [names]);
      const frameRef = useRef<Frame>(null);
      const [pathname, setPathname] = useState(pathnames[0]);

      useLayoutEffect(() => {
        const idx = getIdxByPathname(pathname);

        detectIsFunction(onNavigate) && onNavigate(pathname, idx);
      }, [pathname]);

      const getIdxByPathname = useEvent((pathname: string) => {
        const idx = names.findIndex(x => createPathname(x, prefix) === pathname);

        return idx;
      });

      const getPathnameByIdx = useEvent((idx: number) => {
        const pathname = pathnames[idx];

        return pathname;
      });

      const navigateTo = useEvent((sourcePathname: string, options: NavigateToOptions = {}) => {
        const pathname$ = normalizePathname(sourcePathname);
        const page = refsMap[pathname$];
        const frame = frameRef.current;

        if (!page || pathname === pathname$) return;

        const options$: NavigateToOptions = {
          animated: true,
          transition: {
            name: 'slide',
            duration: 200,
            curve: CoreTypes.AnimationCurve.easeInOut,
          },
          ...options,
        };

        frame.navigate({ create: () => page, ...options$ });
        setPathname(pathname$);
      });

      const goBack = useEvent(() => {
        const frame = frameRef.current;

        frame.goBack();
      });

      const contextValue = useMemo<StackNavigatorContextValue>(
        () => ({ pathname: '', setPathname, navigateTo, goBack }),
        [],
      );

      contextValue.pathname = pathname;

      useImperativeHandle<StackNavigatorRef>(ref, () => ({ navigateTo, goBack, getPathnameByIdx }));

      return StackNavigatorContext.Provider({
        value: contextValue,
        slot: frame({ ref: frameRef, slot }),
      });
    }),
  );

  const Screen = createComponent<StackScreenProps>(({ name, component, options = {}, slot, renderActionBar }) => {
    const { title, headerShown = true } = options;
    const { setPathname } = useStackNavigatorContext();
    const { prefix } = useScreenNavigatorContext();
    const pathname = createPathname(name, prefix);
    const contextValue = useMemo(() => ({ prefix: pathname, parentPrefix: prefix }), []);

    const setRef = (ref: Page) => {
      refsMap[pathname] = ref;
    };

    return ScreenNavigatorContext.Provider({
      value: contextValue,
      slot: [
        page({
          id: pathname,
          ref: setRef,
          actionBarHidden: !headerShown,
          onNavigatingTo: () => setPathname(pathname),
          slot: [
            detectIsFunction(renderActionBar) ? renderActionBar() : ActionBar({ title }),
            detectIsFunction(slot) ? slot() : component(),
          ],
        }),
      ],
    });
  });

  return {
    Navigator: memo(Navigator),
    Screen,
  };
}

const createPathname = (name: string, prefix: string) => {
  return normalizePathname(`${prefix}${name}`);
};

function normalizePathname(pathname: string) {
  const normal = prependSlash(pathname.split(SLASH).filter(Boolean).join(SLASH) + SLASH);

  return normal;
}

function prependSlash(pathname: string) {
  return pathname.startsWith(SLASH) ? pathname : SLASH + pathname;
}

export { createStackNavigator };
