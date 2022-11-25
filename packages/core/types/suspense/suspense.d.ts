import type { DarkElement } from '../shared';
declare type SuspenseContextValue = {
  fallback: DarkElement;
  isLoaded: boolean;
  trigger: () => void;
};
declare const SuspenseContext: import('../context').Context<SuspenseContextValue>;
declare const Suspense: (
  props?: {
    fallback: DarkElement;
  } & Required<
    Readonly<{
      slot: DarkElement;
    }>
  > &
    import('../component').KeyProps &
    import('../component').RefProps<unknown>,
  ref?: import('..').Ref<any>,
) => import('../component/component').ComponentFactory<
  {
    fallback: DarkElement;
  } & Required<
    Readonly<{
      slot: DarkElement;
    }>
  > &
    import('../component').KeyProps &
    import('../component').RefProps<unknown>,
  any
>;
export { SuspenseContext, Suspense };
