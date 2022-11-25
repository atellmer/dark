import { type KeyProps } from '../component';
declare const Fragment: (
  props?: KeyProps &
    Readonly<{
      slot?: import('..').DarkElement;
    }> &
    import('../component').RefProps<unknown>,
  ref?: import('..').Ref<any>,
) => import('../component/component').ComponentFactory<
  KeyProps &
    Readonly<{
      slot?: import('..').DarkElement;
    }> &
    import('../component').RefProps<unknown>,
  any
>;
declare const detectIsFragment: (factory: unknown) => boolean;
export { Fragment, detectIsFragment };
