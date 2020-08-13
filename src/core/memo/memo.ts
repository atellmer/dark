import { createComponent } from '../component';
import { Memo, $$memo } from '../use-memo';


const $$memoProps = Symbol('memoProps');

function memo(component: ReturnType<typeof createComponent>, shouldUpdate: (props: any, nextProps: any) => boolean) {
  return createComponent(props => {
    return Memo({
      [$$memoProps]: props,
      [$$memo]: shouldUpdate,
      slot: component(props),
    });
  });
}

export {
  $$memoProps,
  memo,
};
