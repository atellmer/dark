import { type ComponentFactory, component } from '../component';
import { detectIsUndefined, dummyFn } from '../utils';
import { detectIsServer } from '../platform';
import { useSuspense } from '../suspense';
import { useUpdate } from '../use-update';
import { forwardRef } from '../ref';
import { $$scope } from '../scope';
import { useId } from '../use-id';
import { detectIsFiberAlive } from '../walk';

const $$lazy = Symbol('lazy');
const factories = new Map<Function, ComponentFactory>();

function lazy<P extends object, R = unknown>(module: ModuleFn<P>, done: () => void = dummyFn) {
  return forwardRef(
    component<P, R>(
      function type(props, ref) {
        const $scope = $$scope();
        const suspense = useSuspense();
        const update = useUpdate();
        const id = useId();
        const factory = factories.get(module);
        const fiber = $scope.getCursorFiber();

        if (detectIsUndefined(factory)) {
          suspense.register(id);
          factories.set(module, null);
          const isServer = detectIsServer();
          const isHydrateZone = $scope.getIsHydrateZone();
          const make = async () => {
            factories.set(module, await load(module));
            suspense.unregister(id);
            done();
          };

          if (isServer || isHydrateZone) {
            $scope.defer(make);
          } else {
            make().then(() => {
              if (detectIsFiberAlive(fiber)) {
                update();
              } else {
                suspense.update();
              }
            });
          }
        }

        return factory ? factory(props, ref) : suspense.isLoaded ? suspense.fallback : null;
      },
      { token: $$lazy },
    ),
  );
}

function load<P extends object>(module: ModuleFn<P>) {
  return new Promise<ComponentFactory<P>>(resolve => {
    module().then(module => {
      if (process.env.NODE_ENV !== 'production') {
        if (!module.default) {
          throw new Error('[Dark]: the lazy loaded component should be exported as default!');
        }
      }

      resolve(module.default);
    });
  });
}

type ModuleFn<P extends object> = () => Promise<Module<P>>;
export type Module<P extends object = {}> = { default: ComponentFactory<P> };

export { lazy };
