import { component, forwardRef, useInsertionEffect, useId } from '@dark-engine/core';

import { type Args } from '../styled';
import { STYLED_GLOBAL_ATTR } from '../constants';
import { useThemeContext } from '../context';
import { css, filterArgs } from '../styled';
import { mapProps, getElement, createStyleElement, setAttr, append } from '../utils';

function createGlobalStyle<P extends object>(strings: TemplateStringsArray, ...args: Args<P>) {
  let isInjected = false;
  let tag: HTMLStyleElement = null;
  const fns = filterArgs<P>(args);
  const style = css<P>(strings, ...args);
  const factory = forwardRef<P, unknown>(
    component(props => {
      const { theme } = useThemeContext();
      const id = useId();

      useInsertionEffect(() => {
        if (isInjected) {
          throw new Error('Illegal use of the same global style!');
        } else {
          tag = getTag(id) || createTag(id); // after hydration
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
        const css = style.generate({ props: { ...props, theme }, fns });

        inject(css, tag);
      }, [...mapProps(props), theme]);

      return null;
    }),
  );

  return factory;
}

function createTag(id: string) {
  const tag = createStyleElement();

  setAttr(tag, STYLED_GLOBAL_ATTR, id);
  append(document.head, tag);

  return tag;
}

const getTag = (id: string) => getElement(`[${STYLED_GLOBAL_ATTR}="${id}"]`) as HTMLStyleElement;

const inject = (css: string, tag: HTMLStyleElement) => (tag.textContent = css);

export { createGlobalStyle };
