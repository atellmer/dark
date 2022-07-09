import { type Component, createComponent, detectIsComponentFactory } from '../component';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';
import { useContext } from '../use-context';

const $$lazy = Symbol('lazy');

type LazyScope<P, R> = {
  component: Component<P, R>;
};

function lazy<P, R = unknown>(dynamic: () => Promise<{ default: Component<P> }>) {
  return forwardRef(
    createComponent<P, R>(
      (props, ref) => {
        const { fallback, trigger } = useContext(SuspenseContext);
        const [scope, setScope] = useState<LazyScope<P, R>>({
          component: null,
        });

        useEffect(() => {
          fetchModule(dynamic).then(component => {
            setScope({ component });
          });
        }, []);

        useEffect(() => {
          scope.component && trigger();
        }, [scope.component]);

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
        throw new Error('lazy loaded component should be exported as default!');
      }

      resolve(module.default);
    });
  });
}

export { lazy, detectIsLazy };
