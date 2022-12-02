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

type Routes = {
  transitionTo: (path: string, props?: any) => void;
  on: (eventName: string, callback: (path: string, slot: DarkElement) => void) => void;
  off: (eventName: string, callback: (path: string, slot: DarkElement) => void) => void;
};

const RouterContext = createContext<RouterContextValue>(null);

type RouterContextValue = {
  routes: Routes;
};

type NavLinkProps = {
  to: string;
  slot?: DarkElement;
};

const NavLink = createComponent<NavLinkProps>(({ to, slot }) => {
  const { routes } = useContext(RouterContext);

  const handleClick = (e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => {
    e.preventDefault();
    routes.transitionTo(to);
  };
  const className = location.pathname === to ? 'active-nav-link' : undefined;

  return (
    <a href={to} class={className} onClick={handleClick}>
      {slot}
    </a>
  );
});

type RouterProps = {
  routes: Routes;
  slot: (options: RouterSlotOptions) => DarkElement;
};

type RouterSlotOptions = {
  route: string;
  slot: DarkElement;
};

const Router = createComponent<RouterProps>(({ routes, slot }) => {
  const [rendered, setRendered] = useState<DarkElement>(null);
  const [route, setRoute] = useState('');

  useLayoutEffect(() => {
    const subscriber = (route: string, slot: DarkElement) => {
      batch(() => {
        setRoute(route);
        setRendered(slot);
      });
    };

    routes.on('transition', subscriber);

    return () => routes.off('transition', subscriber);
  }, []);

  useLayoutEffect(() => {
    routes.transitionTo(location.pathname);
  }, []);

  const contextValue = useMemo(() => ({ routes }), []);

  return <RouterContext.Provider value={contextValue}>{slot({ route, slot: rendered })}</RouterContext.Provider>;
});

type Config = Record<string, (props?: any) => DarkElement>;

function createRoutes(config: Config): Routes {
  return createBaseRouter(config);
}

export { createRoutes, Router, NavLink };
