import { type ComponentFactory, component } from '../component';
import { detectIsFunction, detectIsUndefined } from '../helpers';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';
import { useUpdate } from '../use-update';
import { isHydrateZone } from '../scope';
import { $$lazy, $$loaded } from './utils';

const componentsMap: Map<Function, ComponentFactory> = new Map();

function lazy<P, R = unknown>(module: () => Promise<LazyModule<P>>, done?: () => void) {
  return forwardRef(
    component<P, R>(
      function factory(props, ref) {
        const { isLoaded, fallback, reg, unreg } = useContext(SuspenseContext);
        const update = useUpdate({ forceSync: true });
        const component = componentsMap.get(module);

        if (detectIsUndefined(component)) {
          reg();
          componentsMap.set(module, null);
          fetchModule(module).then(component => {
            unreg();
            factory[$$loaded] = true;
            componentsMap.set(module, component);
            !isHydrateZone.get() && update();
            detectIsFunction(done) && done();
          });
        }

        return component ? component(props, ref) : isLoaded ? fallback : null;
      },
      { token: $$lazy },
    ),
  );
}

function fetchModule(module: () => Promise<LazyModule>) {
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

export type LazyModule<P = unknown> = {
  default: ComponentFactory<P>;
};

export { lazy, fetchModule };
