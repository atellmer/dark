import { createComponent, Component } from '../component';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';
import { forwardRef } from '../ref';


type LazyScope<P, R> = {
  component: Component<P, R>;
};

function lazy<P, R = unknown>(dynamic: () => Promise<{default: Component<P>}>) {
  return forwardRef(
    createComponent<P, R>((props, ref) => {
      const [scope, setScope] = useState<LazyScope<P, R>>({
        component: null,
      });

      useEffect(() => {
        dynamic().then(module => {

          if (!module.default) {
            throw new Error('lazy loaded component should be exported as default!');
          }

          setScope({
            component: module.default,
          });
        })
      }, []);

      return scope.component ? scope.component(props, ref) : null;
    }),
  );
}

export {
  lazy,
};
