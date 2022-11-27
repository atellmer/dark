import { type Component } from '../component';
declare function lazy<P, R = unknown>(
  dynamic: () => Promise<{
    default: Component<P>;
  }>,
  done?: () => void,
): (
  props: P &
    import('../component').KeyProps &
    import('../component').RefProps<unknown> &
    import('../component').RefProps<R>,
) => import('../component/component').ComponentFactory<
  P & import('../component').KeyProps & import('../component').RefProps<unknown>,
  R
>;
declare const detectIsLazy: (factory: unknown) => boolean;
declare function fetchModule(
  dynamic: () => Promise<{
    default: Component;
  }>,
): Promise<Component<any, any>>;
export { lazy, detectIsLazy, fetchModule };
