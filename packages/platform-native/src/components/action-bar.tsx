import { ActionBar as NSActionBar } from '@nativescript/core';

import {
  type DarkElement,
  h,
  createComponent,
  forwardRef,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
} from '@dark-engine/core';
import { ActionBarAttributes } from '../jsx';

export type ActionBarProps = {
  slot: DarkElement;
} & ActionBarAttributes;

export type ActionBarRef = {
  view: NSActionBar;
};

const ActionBar = forwardRef<ActionBarProps, ActionBarRef>(
  createComponent(({ slot, ...rest }, ref) => {
    const rootRef = useRef<NSActionBar>(null);

    useLayoutEffect(() => {
      const actionBar = rootRef.current;
      const page = actionBar.page;

      actionBar.parent._removeView(actionBar);
      page.actionBar = actionBar;
    }, []);

    useImperativeHandle(ref, () => ({
      view: rootRef.current,
    }));

    return (
      <action-bar ref={rootRef} {...rest}>
        {slot}
      </action-bar>
    );
  }),
);

export { ActionBar };
