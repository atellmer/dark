import { type Component } from '../component';
declare function lazy<P, R = unknown>(
  dynamic: () => Promise<{
    default: Component<P>;
  }>,
): ({
  ref,
  ...rest
}: P &
  import('../component').KeyProps &
  import('../component').RefProps<unknown> &
  import('../component').RefProps<R>) => import('../component/component').ComponentFactory<
  P & import('../component').KeyProps & import('../component').RefProps<unknown>,
  R
>;
declare const detectIsLazy: (factory: unknown) => boolean;
export { lazy, detectIsLazy };
