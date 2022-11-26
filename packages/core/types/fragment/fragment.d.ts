import { type KeyProps } from '../component';
declare const Fragment: (
  props?: Required<
    Readonly<{
      slot: import('..').DarkElement;
    }>
  > &
    KeyProps &
    import('../component').RefProps<unknown>,
  ref?: import('..').Ref<unknown>,
) => import('../component/component').ComponentFactory<
  Required<
    Readonly<{
      slot: import('..').DarkElement;
    }>
  > &
    KeyProps &
    import('../component').RefProps<unknown>,
  any
>;
declare const detectIsFragment: (factory: unknown) => boolean;
export { Fragment, detectIsFragment };
