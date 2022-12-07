import type { KeyProps } from '../shared';
declare const Fragment: (
  props?: Required<
    Readonly<{
      slot: import('../shared').DarkElement;
    }>
  > &
    KeyProps &
    import('../shared').RefProps<unknown>,
  ref?: import('..').Ref<unknown>,
) => import('../component/component').ComponentFactory<
  Required<
    Readonly<{
      slot: import('../shared').DarkElement;
    }>
  > &
    KeyProps &
    import('../shared').RefProps<unknown>,
  any
>;
declare const detectIsFragment: (factory: unknown) => boolean;
export { Fragment, detectIsFragment };
