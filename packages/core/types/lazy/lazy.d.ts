import { type Component } from '../component';
declare function lazy<P, R = unknown>(
  dynamic: () => Promise<{
    default: Component<P>;
  }>,
  done?: () => void,
): (
  props: P & import('..').KeyProps & import('..').RefProps<unknown> & import('..').RefProps<R>,
) => import('../component/component').ComponentFactory<P & import('..').KeyProps & import('..').RefProps<unknown>, R>;
declare const detectIsLazy: (factory: unknown) => boolean;
declare function fetchModule(
  dynamic: () => Promise<{
    default: Component;
  }>,
): Promise<Component<any, any>>;
export { lazy, detectIsLazy, fetchModule };
