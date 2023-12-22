import { component, forwardRef, useInsertionEffect, useMemo, useId, detectIsServer } from '@dark-engine/core';

import { type Args } from '../styled';
import { STYLED_GLOBAL_ATTR } from '../constants';
import { type ThemeProps, useTheme } from '../theme';
import { useManager } from '../manager';
import { css, inject, filterArgs } from '../styled';
import { mapProps, getElement, createStyleElement, setAttr, append } from '../utils';

let stylesMap: Map<string, string> = null;
let tag: HTMLStyleElement = null;

setupGlobal();

function createGlobalStyle<P extends object = {}>(source: TemplateStringsArray, ...args: Args<P & ThemeProps>) {
  const fns = filterArgs<P>(args);
  const sheet = css<P>(source, ...args);
  const factory = forwardRef<P, unknown>(
    component(props => {
      const theme = useTheme();
      const id = useId();
      const css = useMemo(() => sheet.generate({ props: { ...props, theme }, fns }), [...mapProps(props), theme]);

      useInsertionEffect(() => {
        if (!tag) {
          tag = getTag() || createTag(); // after hydration
        }

        stylesMap.set(id, css);
        reinject(tag, stylesMap);
      }, [css]);

      useInsertionEffect(() => {
        return () => {
          stylesMap.delete(id);
          reinject(tag, stylesMap);
        };
      }, []);

      if (detectIsServer()) {
        const manager = useManager(); // special case of hook using, should be last in order

        manager.collectGlobalStyle(css);
        manager.reset(setupGlobal);
      }

      return null;
    }),
  );

  return factory;
}

function setupGlobal() {
  stylesMap = new Map();
  tag = null;
}

function createTag() {
  const tag = createStyleElement();

  setAttr(tag, STYLED_GLOBAL_ATTR, String(true));
  append(document.head, tag);

  return tag;
}

const getTag = () => getElement(`[${STYLED_GLOBAL_ATTR}="true"]`) as HTMLStyleElement;

const reinject = (tag: HTMLStyleElement, stylesMap: Map<string, string>) => {
  tag.textContent = '';
  stylesMap.forEach(css => inject(css, tag));
};

export { setupGlobal, createGlobalStyle };
