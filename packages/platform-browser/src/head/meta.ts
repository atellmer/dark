import {
  type MutableRef,
  component,
  useLayoutEffect,
  useRef,
  hasKeys,
  mapRecord,
  detectIsString,
} from '@dark-engine/core';

import { type DarkJSX } from '../jsx';
import { meta } from '../factory';

const refs: Array<MutableRef<HTMLMetaElement>> = [];

type MetaProps = {} & DarkJSX.Elements['meta'];

const Meta = component<MetaProps>(({ slot, ...props }) => {
  const hasContent = hasKeys(props) || detectIsString(slot);
  const ref = useRef<HTMLMetaElement>(null);

  useLayoutEffect(() => {
    if (!hasContent) {
      refs.push(ref);
    } else if (!ref.current) {
      ref.current = refs[0].current;
      refs.shift();
    }

    return () => refs.unshift(ref);
  }, []);

  useLayoutEffect(() => {
    if (!hasContent || !ref.current) return;
    const node = ref.current;

    console.log('ref', ref);

    for (const key in props) {
      node.setAttribute(key, props[key]);
    }

    if (detectIsString(slot)) {
      node.textContent = slot;
    }
  }, [...mapRecord(props)]);

  console.log('props', props);

  return hasContent ? null : meta({ ref: ref });
});

export { Meta };
