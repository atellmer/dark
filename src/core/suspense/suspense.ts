import {
  createComponent,
  ComponentFactory,
  Component,
  getComponentFactoryKey,
  KeyProps,
} from '../component';
import { useState } from '../use-state';
import { createContext } from '../context';
import { useEffect } from '@core/use-effect';
import { useMemo } from '../use-memo';
import { detectIsLazy, fetchModule } from '../lazy';
import { flatten, isEmpty } from '@helpers';


type SuspenseProps = {
  fallback: ComponentFactory;
};

type SuspenseScope = {
  isLoaded: boolean;
  components: Array<Component>;
};

type SuspenseContextValue = {
  fromSuspense: boolean;
  components: Array<Component>;
};

const SuspenseContext = createContext<SuspenseContextValue>({
  fromSuspense: false,
  components: [],
});

const Suspense = createComponent<SuspenseProps>(({ fallback, slot }) => {
  if (!fallback) {
    throw new Error('Suspense fallback doesn\'t found');
  }
  const [scope, setScope] = useState<SuspenseScope>({
    isLoaded: false,
    components: [],
  });
  const value = useMemo(() => ({
    fromSuspense: true,
    components: scope.components,
  }), [scope.isLoaded]);

  useEffect(() => {
    const elements = flatten([slot]);
    const asycQueue: Array<Promise<Component>> = [];
    let idx = 0;

    for (const element of elements) {
      if (detectIsLazy(element)) {
        idx++;
        const factory = element as ComponentFactory;
        const { dynamic } = factory;
        const key = getComponentFactoryKey(factory);

        if (isEmpty(key)) {
          (factory.props as KeyProps).key = idx;
        }

        asycQueue.push(
          new Promise<Component>(resolve => {
            fetchModule(dynamic).then(component => resolve(component));
          }),
        );
      }
    }

    Promise.all(asycQueue).then(components => {
      setScope({
        isLoaded: true,
        components,
      });
    });
  }, []);

  return SuspenseContext.Provider({
    value,
    slot: scope.isLoaded ? slot : fallback,
  });
});

export {
  SuspenseContext,
  Suspense,
};
