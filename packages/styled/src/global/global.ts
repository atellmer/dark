import { component, detectIsFunction, useInsertionEffect, forwardRef } from '@dark-engine/core';

import { STYLED_ATTR } from '../constants';
import { useThemeContext } from '../context';
import { StyleSheet } from '../tokens';
import { parse } from '../parse';
import { type Args, type DynamicArgs, slice, join, detectIsStyled } from '../styled';

function createGlobalStyle<P extends object>(strings: TemplateStringsArray, ...args: Args<P>) {
  let isInjected = false;
  let tag: HTMLStyleElement = null;
  const fns = args.filter(x => detectIsFunction(x) && !detectIsStyled(x)) as DynamicArgs<P>;
  const [$static, $dynamics] = slice(parse(join(strings, args)));
  const factory = forwardRef<P, unknown>(
    component(props => {
      const { theme } = useThemeContext();
      const values = Object.keys(props).map(key => props[key]);

      useInsertionEffect(() => {
        if (isInjected) {
          throw new Error('Illegal use of the same global style!');
        } else {
          tag = document.createElement('style');
          tag.setAttribute(STYLED_ATTR, 'true');
          document.head.appendChild(tag);
          isInjected = true;
        }

        return () => {
          if (isInjected) {
            tag.remove();
            tag = null;
            isInjected = false;
          }
        };
      }, []);

      useInsertionEffect(() => {
        const $props = { ...props, theme };
        const css = [
          generate({ stylesheet: $static }),
          ...$dynamics.map(x => generate({ stylesheet: x, props: $props, fns })),
        ].join('');

        inject(css, tag);
      }, [...values, theme]);

      return null;
    }),
  );

  return factory;
}

type GenerateOptions<P extends object> = {
  stylesheet: StyleSheet;
  props?: P;
  fns?: Array<Function>;
};

function generate<P extends object>(options: GenerateOptions<P>) {
  const { stylesheet, props, fns } = options;
  const css = stylesheet.generate(null, props, fns);

  return css;
}

function inject(css: string, tag: HTMLStyleElement) {
  tag.textContent = css;
}

export { createGlobalStyle };
