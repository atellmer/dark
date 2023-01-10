import { ActionBar as NSActionBar, Page as NSPage } from '@nativescript/core';

import { createComponent, forwardRef, useLayoutEffect, useRef, useImperativeHandle } from '@dark-engine/core';
import { ActionBarAttributes } from '../jsx';
import { factory } from '../factory';
import { getTagNativeElement } from '../native-element';

export type ActionBarProps = ActionBarAttributes;

export type ActionBarRef = {
  view: NSActionBar;
};

const actionBar = factory('action-bar');

const ActionBar = forwardRef<ActionBarProps, ActionBarRef>(
  createComponent((props, ref) => {
    const rootRef = useRef<NSActionBar>(null);

    useLayoutEffect(() => {
      const actionBar = rootRef.current;
      const page = actionBar.page || (getTagNativeElement(actionBar).parentElement.getNativeView() as NSPage);

      actionBar.parent?._removeView(actionBar);
      page.actionBar = actionBar;
    }, []);

    useImperativeHandle(ref, () => ({
      view: rootRef.current,
    }));

    return actionBar({ ref: rootRef, ...props });
  }),
);

export { ActionBar };
