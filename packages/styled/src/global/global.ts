import { component, forwardRef, useInsertionEffect, useId, useMemo, detectIsServer } from '@dark-engine/core';

import { type Args } from '../styled';
import { STYLED_GLOBAL_ATTR } from '../constants';
import { useTheme } from '../theme';
import { useManager } from '../manager';
import { css, filterArgs } from '../styled';
import { mapProps, getElement, createStyleElement, setAttr, append } from '../utils';

function createGlobalStyle<P extends object>(strings: TemplateStringsArray, ...args: Args<P>) {
  let isInjected = false;
  let tag: HTMLStyleElement = null;
  const fns = filterArgs<P>(args);
  const style = css<P>(strings, ...args);
  const factory = forwardRef<P, unknown>(
    component(props => {
      const theme = useTheme();
      const manager = useManager();
      const id = useId();
      const css = useMemo(() => style.generate({ props: { ...props, theme }, fns }), [...mapProps(props), theme]);

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
        inject(css, tag);
      }, [css]);

      if (detectIsServer()) {
        manager.collectGlobalStyle(id, css); // ssr
      }

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
