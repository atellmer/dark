import { View, type ViewOptions } from '@dark-engine/core';

type TagProps = Omit<ViewOptions, 'as' | 'isVoid'>;

export const factory =
  (as: string) =>
  (props: TagProps = {}) => {
    props.as = as;
    return View(props as ViewOptions);
  };
