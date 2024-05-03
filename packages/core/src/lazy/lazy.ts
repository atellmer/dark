import { type ComponentFactory, component } from '../component';
import { detectIsUndefined, dummyFn } from '../utils';
import { detectIsServer } from '../platform';
import { detectIsFiberAlive } from '../walk';
import { useSuspense } from '../suspense';
import { useUpdate } from '../use-update';
import { forwardRef } from '../ref';
import { $$scope } from '../scope';
import { useId } from '../use-id';

const $$lazy = Symbol('lazy');
const factories = new Map<Function, ComponentFactory>();

function lazy<P extends object, R = unknown>(module: ModuleFn<P>, done: () => void = dummyFn) {
  return forwardRef(
    component<P, R>(
      (props, ref) => {
        const $scope = $$scope();
        const suspense = useSuspense();
        const update = useUpdate();
        const id = useId();
        const factory = factories.get(module);
        const fiber = $scope.getCursorFiber();
        const $update = () => {
          detectIsFiberAlive(fiber) ? update() : suspense.update && suspense.update();
        };

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
            make().then($update);
          }
        }

        return factory ? factory(props, ref) : suspense.isLoaded ? suspense.fallback : null;
      },
      { token: $$lazy, displayName: 'Lazy' },
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
