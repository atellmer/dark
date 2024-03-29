import type { ActionBar as NSActionBar } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef, useRef, useImperativeHandle } from '@dark-engine/core';

import type { ActionBarAttributes } from '../jsx';
import { actionBar } from '../factory';

export type ActionBarProps = ActionBarAttributes;

export type ActionBarRef = {
  view: NSActionBar;
};

const ActionBar = forwardRef<ActionBarProps, ActionBarRef>(
  component(
    (props, ref) => {
      const rootRef = useRef<NSActionBar>(null);

      useImperativeHandle(ref, () => ({
        view: rootRef.current,
      }));

      return actionBar({ ref: rootRef, ...props });
    },
    { displayName: 'ActionBar' },
  ),
) as ComponentFactory<ActionBarProps, ActionBarRef>;

export { ActionBar };
