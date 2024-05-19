import { component, useInsertionEffect, useMemo, useId, detectIsServer, mapRecord } from '@dark-engine/core';

import { detectIsBrowser, getElement, insertBefore, getElements, createStyleElement, setAttr, append } from '../utils';
import { STYLED_ATTR, GLOBAL_ATTR_VALUE, INTERLEAVE_GLOBAL_ATTR_VALUE } from '../constants';
import { ast, inject, reuse, getTag as getStyleTag, filterArgs } from '../styled';
import { type ThemeProps, useTheme } from '../theme';
import { useManager } from '../server/manager';
import { type Args } from '../styled';

let cache: Map<string, string> = null;
let tag: HTMLStyleElement = null;
let isLoaded = false;

setupGlobal();

function createGlobalStyle<P extends object = {}>(source: TemplateStringsArray, ...args: Args<P & ThemeProps>) {
  if (!isLoaded && detectIsBrowser()) {
    reuse(getInterleavedElements(), createTag, false);
    isLoaded = true;
  }

  const fns = filterArgs<P>(args);
  const sheet = ast<P>(source, ...args);
  const factory = component<P>(
    props => {
      const theme = useTheme();
      const id = useId();
      const css = useMemo(() => sheet.generate({ props: { ...props, theme }, fns }), [...mapRecord(props), theme]);

      useInsertionEffect(() => {
        tag = tag || getTag() || createTag();
        cache.set(id, css);
        reinject(tag, cache);
      }, [css]);

      useInsertionEffect(() => {
        return () => {
          cache.delete(id);
          reinject(tag, cache);
        };
      }, []);

      if (detectIsServer()) {
        const manager = useManager(); // special case of hook using, should be last in order

        manager.collectGlobalStyle(css);
        manager.reset(setupGlobal);
      }

      return null;
    },
    { displayName: 'GlobalStyle' },
  );

  return factory;
}

function setupGlobal() {
  cache = new Map();
  tag = null;
  isLoaded = false;
}

function createTag() {
  const tag1 = createStyleElement();
  const tag2 = getStyleTag();

  setAttr(tag1, STYLED_ATTR, GLOBAL_ATTR_VALUE);

  if (tag2) {
    insertBefore(document.head, tag1, tag2);
  } else {
    append(document.head, tag1);
  }

  return tag1;
}

function getInterleavedElements() {
  return getElements(`[${STYLED_ATTR}="${INTERLEAVE_GLOBAL_ATTR_VALUE}"]`) as Array<HTMLStyleElement>;
}

const getTag = () => getElement(`[${STYLED_ATTR}="${GLOBAL_ATTR_VALUE}"]`) as HTMLStyleElement;

const reinject = (tag: HTMLStyleElement, stylesMap: Map<string, string>) => {
  tag.textContent = '';
  stylesMap.forEach(css => inject(css, tag));
};

export { setupGlobal, createGlobalStyle };
