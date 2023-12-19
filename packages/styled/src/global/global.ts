import { component, forwardRef, useInsertionEffect, useMemo, useId, detectIsServer } from '@dark-engine/core';

import { type Args } from '../styled';
import { STYLED_GLOBAL_ATTR } from '../constants';
import { useTheme } from '../theme';
import { useManager } from '../manager';
import { css, inject, filterArgs } from '../styled';
import { mapProps, getElement, createStyleElement, setAttr, append } from '../utils';

const styles = new Map<string, string>();
let tag: HTMLStyleElement = null;

function createGlobalStyle<P extends object>(strings: TemplateStringsArray, ...args: Args<P>) {
  const fns = filterArgs<P>(args);
  const style = css<P>(strings, ...args);
  const factory = forwardRef<P, unknown>(
    component(props => {
      const theme = useTheme();
      const id = useId();
      const css = useMemo(() => style.generate({ props: { ...props, theme }, fns }), [...mapProps(props), theme]);
      const key = `${id}-${css}`;

      useInsertionEffect(() => {
        if (!tag) {
          tag = getTag() || createTag(); // after hydration
        }

        if (!styles.has(key)) {
          styles.set(key, css);
          inject(css, tag);
        }
      }, [key]);

      useInsertionEffect(() => {
        return () => {
          styles.delete(key);
          tag.textContent = '';
          styles.forEach(css => inject(css, tag));
        };
      }, []);

      if (detectIsServer()) {
        const manager = useManager(); // special case of hook using, should be last in order

        manager.collectGlobalStyle(css); // ssr
      }

      return null;
    }),
  );

  return factory;
}

function createTag() {
  const tag = createStyleElement();

  setAttr(tag, STYLED_GLOBAL_ATTR, 'true');
  append(document.head, tag);

  return tag;
}

const getTag = () => getElement(`[${STYLED_GLOBAL_ATTR}="true"]`) as HTMLStyleElement;

export { createGlobalStyle };
