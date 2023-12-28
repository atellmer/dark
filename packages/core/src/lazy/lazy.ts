import { type ComponentFactory, component } from '../component';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsUndefined, dummyFn } from '../utils';
import { SuspenseContext } from '../suspense';
import { detectIsServer } from '../platform';
import { useUpdate } from '../use-update';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { $$scope } from '../scope';
import { useId } from '../use-id';

const $$lazy = Symbol('lazy');
const factories = new Map<Function, ComponentFactory>();

function lazy<P extends object, R = unknown>(module: ModuleFn<P>, done: () => void = dummyFn) {
  return forwardRef(
    component<P, R>(
      function type(props, ref) {
        const { register, unregister } = useContext(SuspenseContext);
        const $scope = $$scope();
        const update = useUpdate();
        const id = useId();
        const factory = factories.get(module);

        if (detectIsUndefined(factory)) {
          const isServer = detectIsServer();
          const isHydrateZone = $scope.getIsHydrateZone();
          const make = async () => {
            factories.set(module, await load(module));
            unregister(id);
            done();
          };

          register(id);
          factories.set(module, null);

          if (isServer || isHydrateZone) {
            $scope.defer(make);
          } else {
            make().then(() => update());
          }
        }

        useLayoutEffect(() => () => unregister(id), []);

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
