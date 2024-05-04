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
const factories = new Map<LoaderFn, ComponentFactory>();

function lazy<P extends object, R = unknown>(loader: LoaderFn<P>, done: () => void = dummyFn) {
  return forwardRef(
    component<P, R>(
      (props, ref) => {
        const $scope = $$scope();
        const suspense = useSuspense();
        const update = useUpdate();
        const id = useId();
        const factory = factories.get(loader);
        const fiber = $scope.getCursorFiber();
        const $update = () => {
          if (fiber.alt) {
            suspense.update && suspense.update(); //!
          } else {
            detectIsFiberAlive(fiber) ? update() : suspense.update && suspense.update();
          }
        };

        if (detectIsUndefined(factory)) {
          suspense.register(id);
          factories.set(loader, null);
          const isServer = detectIsServer();
          const isHydrateZone = $scope.getIsHydrateZone();
          const make = async () => {
            factories.set(loader, await run(loader));
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

function run<P extends object>(loader: LoaderFn<P>) {
  return new Promise<ComponentFactory<P>>((resolve, reject) => {
    loader().then(module => {
      if (process.env.NODE_ENV !== 'production') {
        if (!module.default) {
          return reject(new Error('[Dark]: the lazy loaded component should be exported as default!'));
        }
      }

      setTimeout(() => {
        resolve(module.default);
      }, 1000);
    });
  });
}

type LoaderFn<P extends object = {}> = () => Promise<Module<P>>;

export type Module<P extends object = {}> = { default: ComponentFactory<P> };

export { lazy };
