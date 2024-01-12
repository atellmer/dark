import { View, type ViewOptions } from '@dark-engine/core';

type TagProps = Omit<ViewOptions, 'as' | 'isVoid'>;

export const factory =
  <P extends object>(as: string) =>
  (props?: P) => {
    const $props = props || {};
    ($props as TagProps).as = as;
    return View($props as ViewOptions);
  };
