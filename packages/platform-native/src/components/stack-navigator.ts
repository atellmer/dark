import { CoreTypes, type NavigationTransition } from '@nativescript/core';

import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
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
import { type NS } from '..';
import { ActionBar } from './action-bar';
import { frame, page } from '../factory';
import { SLASH } from '../constants';

const refsMap: Record<string, NS.Page> = {};

export type StackNavigatorProps = {
  slot: Array<ComponentFactory<StackScreenProps & StandardComponentProps>>;
  onNavigate?: (name: string, idx: number) => void;
};

export type StackNavigatorRef = {
  getPathnameByIdx: (idx: number) => string;
} & Pick<StackNavigatorContextValue, 'navigateTo' | 'goBack'>;

export type StackScreenProps = {
  name: string;
  component: Component;
  options?: StackScreenOptions;
};

export type StackScreenOptions = {
  title?: string;
  headerShown?: boolean;
};

type StackNavigatorContextValue = {
  prefix: string;
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
  prefix: '/',
  pathname: '',
  setPathname: () => {},
  navigateTo: () => {},
  goBack: () => {},
});

function useStackNavigatorContext() {
  const value = useContext(StackNavigatorContext);

  return value;
}

function useNavigation() {
  const { navigateTo, goBack, prefix, pathname } = useStackNavigatorContext();

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
      const { prefix } = useStackNavigatorContext();
      const names: Array<string> = useMemo(() => slot.map(x => x.props.name), []);
      const pathnames: Array<string> = useMemo(() => names.map(x => createPathname(x, prefix)), [names]);
      const frameRef = useRef<NS.Frame>(null);
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

      const navigateTo = useEvent((pathname$: string, options: NavigateToOptions = {}) => {
        const pathname = normalizePathname(pathname$);
        const page = refsMap[pathname];
        const frame = frameRef.current;
        if (frame.currentPage === page) return;
        const options$: NavigateToOptions = {
          animated: true,
          transition: {
            name: 'slide',
            duration: 100,
            curve: CoreTypes.AnimationCurve.easeInOut,
          },
          ...options,
        };

        frame.navigate({ create: () => page, ...options$ });
        setPathname(pathname);
      });

      const goBack = useEvent(() => {
        const frame = frameRef.current;

        frame.goBack();
      });

      const contextValue = useMemo<StackNavigatorContextValue>(
        () => ({ prefix, pathname, setPathname, navigateTo, goBack }),
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

  const Screen = createComponent<StackScreenProps>(({ name, component, options = {} }) => {
    const { title, headerShown = true } = options;
    const { prefix, setPathname } = useStackNavigatorContext();
    const pathname = createPathname(name, prefix);

    const setRef = (ref: NS.Page) => {
      refsMap[pathname] = ref;
    };

    return page({
      id: pathname,
      ref: setRef,
      actionBarHidden: !headerShown,
      onNavigatingTo: () => setPathname(pathname),
      slot: [ActionBar({ title }), component()],
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
  const normal = pathname.split(SLASH).filter(Boolean).join(SLASH) + SLASH;

  return normal;
}

export { createStackNavigator, useNavigation };
