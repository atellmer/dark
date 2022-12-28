import { type Component, createComponent, detectIsComponentFactory } from '../component';
import { detectIsFunction } from '../helpers';
import { useUpdate } from '../use-update';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';
import { detectIsServer, platform } from '../platform';
import { registerLazy, unregisterLazy, detectHasRegisteredLazy, isHydrateZone } from '../scope';

const $$lazy = Symbol('lazy');

const componentsMap: Map<Function, Component> = new Map();

function lazy<P, R = unknown>(module: () => Promise<{ default: Component<P> }>, done?: () => void) {
  return forwardRef(
    createComponent<P, R>(
      (props, ref) => {
        if (detectIsServer()) {
          throw new Error('[Dark]: You should render only non-lazy components on the server!');
        }
        const { fallback } = useContext(SuspenseContext);
        const update = useUpdate();
        const component = componentsMap.get(module) || null;

        if (!component) {
          const id = registerLazy();

          fetchModule(module).then(component => {
            componentsMap.set(module, component);

            unregisterLazy(id);

            if (isHydrateZone.get()) {
              if (!detectHasRegisteredLazy()) {
                platform.restart();
              }
            } else {
              update();
            }

            detectIsFunction(done) && done();
          });
        }

        return component ? component(props, ref) : fallback;
      },
      { token: $$lazy },
    ),
  );
}

const detectIsLazy = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$lazy;

function fetchModule(module: () => Promise<{ default: Component }>) {
  return new Promise<Component>(resolve => {
    module().then(module => {
      if (!module.default) {
        throw new Error('[Dark]: Lazy loaded component should be exported as default!');
      }

      resolve(module.default);
    });
  });
}

export { lazy, detectIsLazy, fetchModule };
