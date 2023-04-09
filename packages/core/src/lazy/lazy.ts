import { type ComponentFactory, component } from '../component';
import { detectIsFunction, detectIsUndefined } from '../helpers';
import { useUpdate } from '../use-update';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';
import { detectIsServer } from '../platform';
import { isHydrateZone } from '../scope';
import { $$lazy, $$loaded } from './utils';

const componentsMap: Map<Function, ComponentFactory> = new Map();

function lazy<P, R = unknown>(module: () => Promise<{ default: ComponentFactory<P> }>, done?: () => void) {
  return forwardRef(
    component<P, R>(
      function factory(props, ref) {
        if (process.env.NODE_ENV !== 'production') {
          if (detectIsServer()) {
            throw new Error('[Dark]: You should render only non-lazy components on the server!');
          }
        }
        const { fallback } = useContext(SuspenseContext);
        const update = useUpdate();
        const component = componentsMap.get(module);

        if (detectIsUndefined(component)) {
          componentsMap.set(module, null);
          fetchModule(module).then(component => {
            factory[$$loaded] = true;
            componentsMap.set(module, component);
            !isHydrateZone.get() && update();
            detectIsFunction(done) && done();
            console.log('loaded');
          });
        }

        return component ? component(props, ref) : fallback;
      },
      { token: $$lazy },
    ),
  );
}

function fetchModule(module: () => Promise<{ default: ComponentFactory }>) {
  return new Promise<ComponentFactory>(resolve => {
    module().then(module => {
      if (process.env.NODE_ENV !== 'production') {
        if (!module.default) {
          throw new Error('[Dark]: Lazy loaded component should be exported as default!');
        }
      }

      resolve(module.default);
    });
  });
}

export { lazy, fetchModule };
