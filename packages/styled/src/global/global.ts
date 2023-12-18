import { component, useInsertionEffect, forwardRef } from '@dark-engine/core';

import { STYLED_ATTR } from '../constants';
import { useThemeContext } from '../context';
import { type Args, css, filterArgs } from '../styled';
import { mapProps } from '../utils';

function createGlobalStyle<P extends object>(strings: TemplateStringsArray, ...args: Args<P>) {
  let isInjected = false;
  let tag: HTMLStyleElement = null;
  const fns = filterArgs<P>(args);
  const style = css<P>(strings, ...args);
  const factory = forwardRef<P, unknown>(
    component(props => {
      const { theme } = useThemeContext();

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
        const css = style.generate(null, { ...props, theme }, fns);

        inject(css, tag);
      }, [...mapProps(props), theme]);

      return null;
    }),
  );

  return factory;
}

const inject = (css: string, tag: HTMLStyleElement) => (tag.textContent = css);

export { createGlobalStyle };
