import {
  type ComponentFactory,
  type TagVirtualNodeFactory,
  component,
  View,
  detectIsString,
  detectIsFunction,
  detectIsTextBased,
} from '@dark-engine/core';

import { FN_INSERTION_MARK } from '../constants';
import { parse } from '../parse';

function createStyledComponent<P>(factory: ComponentFactory | ((props: P) => TagVirtualNodeFactory)) {
  return (strings: TemplateStringsArray, ...args: Args<P>) => {
    const dynamicArgs = args.filter(x => detectIsFunction(x)) as DynamicArgs<P>;
    const joined = join(strings, args);
    const parsed = parse(joined);
    const css = parsed.generate('test', {}, dynamicArgs);

    console.log('joined', joined);
    console.log('parsed', parsed);
    console.log('css', css);

    const styled = component<P>(props => {
      return factory({ ...props });
    });

    return styled;
  };
}

function styled<P>(tag: string | ComponentFactory) {
  return detectIsString(tag)
    ? createStyledComponent<P>((props: P) => View({ ...props, as: tag }))
    : createStyledComponent<P>(tag);
}

function join<P>(strings: TemplateStringsArray, args: Args<P>) {
  let joined = '';

  for (let i = 0; i < strings.length; i++) {
    joined += strings[i];

    if (detectIsFunction(args[i])) {
      joined += FN_INSERTION_MARK;
    } else if (detectIsTextBased(args[i])) {
      joined += args[i];
    }
  }

  return joined;
}

type TextBased = string | number;

type ArgFn<P> = (p: P) => TextBased | false;

type DynamicArgs<P> = Array<ArgFn<P>>;

type Args<P> = Array<TextBased | ArgFn<P>>;

export { styled };
