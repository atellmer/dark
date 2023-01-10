import { ActionBar as NSActionBar } from '@nativescript/core';

import { createComponent, forwardRef, useRef, useImperativeHandle } from '@dark-engine/core';
import { ActionBarAttributes } from '../jsx';
import { factory } from '../factory';

export type ActionBarProps = ActionBarAttributes;

export type ActionBarRef = {
  view: NSActionBar;
};

const actionBar = factory('action-bar');

const ActionBar = forwardRef<ActionBarProps, ActionBarRef>(
  createComponent((props, ref) => {
    const rootRef = useRef<NSActionBar>(null);

    useImperativeHandle(ref, () => ({
      view: rootRef.current,
    }));

    return actionBar({ ref: rootRef, ...props });
  }),
);

export { ActionBar };
