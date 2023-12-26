import { type ComponentFactory, component } from '../component';
import { detectIsFunction, detectIsUndefined } from '../utils';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';
import { detectIsServer } from '../platform';
import { $$scope } from '../scope';
import { useUpdate } from '../use-update';
import { detectIsFiberAlive } from '../walk';

const $$lazy = Symbol('lazy');
const factories = new Map<Function, ComponentFactory>();

function lazy<P extends object, R = unknown>(module: () => Promise<LazyModule<P>>, done?: () => void) {
  return forwardRef(
    component<P, R>(
      function type(props, ref) {
        const { isLoaded, fallback, update: $$update, reg, unreg } = useContext(SuspenseContext);
        const $scope = $$scope();
        const $update = useUpdate();
        const fiber = $scope.getCursorFiber();
        const factory = factories.get(module);
        const update = () => (detectIsFiberAlive(fiber) ? $update() : $$update());

        if (detectIsUndefined(factory)) {
          const isServer = detectIsServer();
          const isHydrateZone = $scope.getIsHydrateZone();
          const fn = async () => {
            const component = await load(module);

            unreg();
            factories.set(module, component);
            detectIsFunction(done) && done();
          };

          reg();
          factories.set(module, null);

          if (isServer || isHydrateZone) {
            $scope.defer(fn);
          } else {
            fn().then(update);
          }
        }

        return factory ? factory(props, ref) : isLoaded ? fallback : null;
      },
      { token: $$lazy },
    ),
  );
}

function load(module: () => Promise<LazyModule>) {
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

export type LazyModule<P extends object = {}> = {
  default: ComponentFactory<P>;
};

export { lazy };
