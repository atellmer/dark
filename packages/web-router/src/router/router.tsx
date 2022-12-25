import { type DarkElement, h, createComponent, useMemo } from '@dark-engine/core';

import { type RouterContextValue, RouterContext } from '../context';
import { type RoutesMap } from '../create-routes';
import { match } from '../utils';

type RouterProps = {
  routes: RoutesMap;
  slot: (options: RouterSlotOptions) => DarkElement;
};

type RouterSlotOptions = {
  slot: DarkElement;
};

const Router = createComponent<RouterProps>(({ routes, slot }) => {
  const currentPath = '/profile/1/photo/2/comment/3/broken';
  console.log('currentPath', currentPath);
  const { path, params } = useMemo(() => match(currentPath, routes), [currentPath]);
  const context = useMemo<RouterContextValue>(() => ({}), []);

  return (
    <RouterContext.Provider value={context}>
      {slot({
        slot: null,
      })}
    </RouterContext.Provider>
  );
});

export { Router };
