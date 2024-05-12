import type { ActionBar as NSActionBar } from '@nativescript/core';
import { type ComponentFactory, type Ref, component, useRef, useImperativeHandle } from '@dark-engine/core';

import type { ActionBarAttributes } from '../jsx';
import { actionBar } from '../factory';

export type ActionBarProps = ActionBarAttributes;

export type ActionBarRef = {
  ref?: Ref<ActionBarRef>;
  view: NSActionBar;
};

const ActionBar = component<ActionBarProps>(
  props => {
    const { ref, ...rest } = props;
    const rootRef = useRef<NSActionBar>(null);

    useImperativeHandle(ref, () => ({
      view: rootRef.current,
    }));

    return actionBar({ ref: rootRef, ...rest });
  },
  { displayName: 'ActionBar' },
) as ComponentFactory<ActionBarProps>;

export { ActionBar };
