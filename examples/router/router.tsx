import createBaseRouter from 'base-router';
import {
  h,
  createComponent,
  useLayoutEffect,
  useState,
  batch,
  createContext,
  useContext,
  useMemo,
  type DarkElement,
} from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';

type Router = {
  transitionTo: (path: string, props?: any) => void;
  on: (eventName: string, callback: (path: string, slot: DarkElement) => void) => void;
  off: (eventName: string, callback: (path: string, slot: DarkElement) => void) => void;
};

const RouterContext = createContext<RouterContextValue>(null);

type RouterContextValue = {
  router: Router;
};

type NavLinkProps = {
  to: string;
  slot?: DarkElement;
};

const NavLink = createComponent<NavLinkProps>(({ to, slot }) => {
  const { router } = useContext(RouterContext);

  const handleClick = (e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => {
    e.preventDefault();
    router.transitionTo(to);
  };
  const className = location.pathname === to ? 'active-nav-link' : undefined;

  return (
    <a href={to} class={className} onClick={handleClick}>
      {slot}
    </a>
  );
});

type RouterProps = {
  router: Router;
  slot: (options: RouterSlotOptions) => DarkElement;
};

type RouterSlotOptions = {
  route: string;
  slot: DarkElement;
};

const Router = createComponent<RouterProps>(({ router, slot }) => {
  const [rendered, setRendered] = useState<DarkElement>(null);
  const [route, setRoute] = useState('');

  useLayoutEffect(() => {
    const subscriber = (route: string, slot: DarkElement) => {
      batch(() => {
        setRoute(route);
        setRendered(slot);
      });
    };

    router.on('transition', subscriber);

    return () => router.off('transition', subscriber);
  }, []);

  useLayoutEffect(() => {
    router.transitionTo(location.pathname);
  }, []);

  const contextValue = useMemo(() => ({ router }), []);

  return <RouterContext.Provider value={contextValue}>{slot({ route, slot: rendered })}</RouterContext.Provider>;
});

type Routes = Record<string, (props?: any) => DarkElement>;

function createRouter(routes: Routes) {
  return createBaseRouter(routes);
}

export { createRouter, Router, NavLink };
