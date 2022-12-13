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
    import('../shared').KeyProps &
    import('../shared').RefProps<unknown> &
    import('../shared').FlagProps,
  ref?: import('..').Ref<unknown>,
) => import('../component/component').ComponentFactory<
  {
    fallback: DarkElement;
  } & Required<
    Readonly<{
      slot: DarkElement;
    }>
  > &
    import('../shared').KeyProps &
    import('../shared').RefProps<unknown> &
    import('../shared').FlagProps,
  any
>;
export { SuspenseContext, Suspense };
