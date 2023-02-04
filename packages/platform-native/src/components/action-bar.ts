import type { ActionBar as NSActionBar } from '@nativescript/core';
import { type Component, createComponent, forwardRef, useRef, useImperativeHandle } from '@dark-engine/core';

import type { ActionBarAttributes } from '../jsx';
import { actionBar } from '../factory';

export type ActionBarProps = ActionBarAttributes;

export type ActionBarRef = {
  view: NSActionBar;
};

const ActionBar = forwardRef<ActionBarProps, ActionBarRef>(
  createComponent((props, ref) => {
    const rootRef = useRef<NSActionBar>(null);

    useImperativeHandle(ref, () => ({
      view: rootRef.current,
    }));

    return actionBar({ ref: rootRef, ...props });
  }),
) as Component<ActionBarProps, ActionBarRef>;

export { ActionBar };
