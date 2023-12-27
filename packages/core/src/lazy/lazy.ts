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

function lazy<P extends object, R = unknown>(module: ModuleFn<P>, done?: () => void) {
  return forwardRef(
    component<P, R>(
      function type(props, ref) {
        const { update: $$update, on, off } = useContext(SuspenseContext);
        const $scope = $$scope();
        const $update = useUpdate();
        const fiber = $scope.getCursorFiber();
        const factory = factories.get(module);
        const update = () => (detectIsFiberAlive(fiber) ? $update() : $$update());

        if (detectIsUndefined(factory)) {
          const isServer = detectIsServer();
          const isHydrateZone = $scope.getIsHydrateZone();
          const make = async () => {
            const factory = await load(module);

            off();
            factories.set(module, factory);
            detectIsFunction(done) && done();
          };

          on();
          factories.set(module, null);

          if (isServer || isHydrateZone) {
            $scope.defer(make);
          } else {
            make().then(update);
          }
        }

        return factory ? factory(props, ref) : null;
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
          throw new Error('[Dark]: Lazy loaded component should be exported as default!');
        }
      }

      resolve(module.default);
    });
  });
}

type ModuleFn<P extends object> = () => Promise<Module<P>>;

export type Module<P extends object = {}> = { default: ComponentFactory<P> };

export { lazy };
