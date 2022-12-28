import { type Component, createComponent, detectIsComponentFactory } from '../component';
import { detectIsFunction } from '../helpers';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';

const $$lazy = Symbol('lazy');

type LazyScope<P, R> = {
  component: Component<P, R>;
};

function lazy<P, R = unknown>(dynamic: () => Promise<{ default: Component<P> }>, done?: () => void) {
  return forwardRef(
    createComponent<P, R>(
      (props, ref) => {
        const { fallback } = useContext(SuspenseContext);
        const [scope, setScope] = useState<LazyScope<P, R>>({ component: null });

        useEffect(() => {
          fetchModule(dynamic).then(component => {
            setScope({ component });
            detectIsFunction(done) && done();
          });
        }, []);

        return scope.component ? scope.component(props, ref) : fallback;
      },
      { token: $$lazy },
    ),
  );
}

const detectIsLazy = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$lazy;

function fetchModule(dynamic: () => Promise<{ default: Component }>) {
  return new Promise<Component>(resolve => {
    dynamic().then(module => {
      if (!module.default) {
        throw new Error('[Dark]: lazy loaded component should be exported as default!');
      }

      resolve(module.default);
    });
  });
}

export { lazy, detectIsLazy, fetchModule };
