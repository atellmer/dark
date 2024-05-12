import { type MutableRef, detectIsString, component, useLayoutEffect, useRef } from '@dark-engine/core';

import { title } from '../factory';

let ref: MutableRef<HTMLTitleElement> = null;

type TitleProps = {
  slot?: string;
};

const Title = component<TitleProps>(({ slot }) => {
  const hasContent = detectIsString(slot);
  const __ref = useRef<HTMLTitleElement>(null);
  ref = ref || __ref;

  useLayoutEffect(() => {
    if (ref.current && hasContent) {
      ref.current.innerText = slot;
    }
  });

  return hasContent ? null : title({ ref: __ref });
});

export { Title };
