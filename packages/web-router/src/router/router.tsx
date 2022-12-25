import { type DarkElement, h, createComponent, useMemo, useState } from '@dark-engine/core';

import { type RouterContextValue, RouterContext } from '../context';
import { type RoutesMap } from '../create-routes';

type RouterProps = {
  routes: RoutesMap;
  slot: (options: RouterSlotOptions) => DarkElement;
};

type RouterSlotOptions = {
  slot: DarkElement;
};

const Router = createComponent<RouterProps>(({ routes, slot }) => {
  const currentPath = '/home/tabs';
  const [path, setPath] = useState(() => match(currentPath, routes));
  const context = useMemo<RouterContextValue>(() => ({}), []);

  return (
    <RouterContext.Provider value={context}>
      {slot({
        slot: null,
      })}
    </RouterContext.Provider>
  );
});

function match(path: string, routesMap: RoutesMap): string {
  const routes = Object.keys(routesMap).map(key => routesMap[key]);
  const splitted = path.split('/').filter(Boolean);

  return '';
}

export { Router };
