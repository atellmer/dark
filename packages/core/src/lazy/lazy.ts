import { detectIsUndefined, detectIsFunction, illegal, throwThis } from '../utils';
import { type ComponentFactory, component } from '../component';
import { useMemo } from '../use-memo';

const $$lazy = Symbol('lazy');
const factories = new Map<Loader, ComponentFactory>();

function lazy<P extends object>(loader: Loader<P>, done?: () => void) {
  return component<P>(
    props => {
      const scope = useMemo(() => ({ isDirty: false }), []);
      const factory = factories.get(loader);

      if (detectIsUndefined(factory) && !scope.isDirty) {
        const make = async () => {
          factories.set(loader, await run(loader));
          detectIsFunction(done) && done();
        };

        scope.isDirty = true;
        throwThis(make());
      }

      return factory ? factory(props) : null;
    },
    { token: $$lazy, displayName: 'Lazy' },
  );
}

function run<P extends object>(loader: Loader<P>) {
  return new Promise<ComponentFactory<P>>((resolve, reject) => {
    loader()
      .then(module => {
        check(module);
        resolve(module.default);
      })
      .catch(reject);
  });
}

function check(module: Module) {
  if (process.env.NODE_ENV !== 'production') {
    if (!module.default) {
      illegal('The lazy loaded component should be exported as default!');
    }
  }
}

type Loader<P extends object = {}> = () => Promise<Module<P>>;

export type Module<P extends object = {}> = { default: ComponentFactory<P> };

export { lazy };
