import type { DarkElement } from '../shared';
declare type SuspenseProps = {
  fallback: DarkElement;
};
declare type SuspenseContextValue = {
  fallback: DarkElement;
  isLoaded: boolean;
  trigger: () => void;
};
declare const SuspenseContext: import('../context').Context<SuspenseContextValue>;
declare const Suspense: (
  props?: SuspenseProps &
    import('../component').KeyProps &
    Readonly<{
      slot?: DarkElement;
    }> &
    import('../component').RefProps<unknown>,
  ref?: import('..').Ref<any>,
) => import('../component/component').ComponentFactory<
  SuspenseProps &
    import('../component').KeyProps &
    Readonly<{
      slot?: DarkElement;
    }> &
    import('../component').RefProps<unknown>,
  any
>;
export { SuspenseContext, Suspense };
