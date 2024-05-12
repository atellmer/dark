import {
  type MutableRef,
  type StandardComponentProps,
  type SlotProps,
  component,
  useLayoutEffect,
  useRef,
  hasKeys,
  mapRecord,
  detectIsString,
} from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';
import { meta, title, link, script } from '../factory';
import { illegal, capitalize } from '../utils';
import { type DarkJSX } from '../jsx';
import { DANGER_HTML_CONTENT } from '../constants';

const tags = {
  meta,
  title,
  link,
  script,
};

function createFactory<P extends StandardComponentProps & Partial<SlotProps>, E extends TagNativeElement>(
  name: string,
) {
  const refs: Array<MutableRef<E>> = [];

  return component<P>(
    ({ slot, ...props }) => {
      const hasContent = hasKeys(props) || detectIsString(slot);
      const ref = useRef<E>(null);
      const danger = props[DANGER_HTML_CONTENT];

      useLayoutEffect(() => {
        if (!hasContent) {
          refs.push(ref);
        } else if (!ref.current) {
          if (refs[0]) {
            ref.current = refs[0].current;
            refs.shift();
          } else {
            illegal(`Inconsistent metadata tag "${name}"!`);
          }
        }

        return () => ref.current && refs.unshift(ref);
      }, []);

      useLayoutEffect(() => {
        if (!hasContent || !ref.current) return;
        const node = ref.current;

        console.log('name', name);
        console.log('ref', ref);
        console.log('props', props);

        for (const key in props) {
          if (key !== DANGER_HTML_CONTENT) {
            node.setAttribute(key, props[key]);
          }
        }

        if (detectIsString(slot)) {
          node.textContent = slot;
        } else if (danger) {
          node.innerHTML = danger;
        }
      }, [...mapRecord(props)]);

      return hasContent ? null : tags[name]({ ref });
    },
    { displayName: `Head.${capitalize(name)}` },
  );
}

const Head = {
  Meta: createFactory<DarkJSX.Elements['meta'], HTMLMetaElement>('meta'),
  Title: createFactory<DarkJSX.Elements['title'], HTMLTitleElement>('title'),
  Link: createFactory<DarkJSX.Elements['link'], HTMLLinkElement>('link'),
  Script: createFactory<DarkJSX.Elements['script'], HTMLScriptElement>('script'),
};

export { Head };
