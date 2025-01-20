import { type DarkElement, unmountRoot } from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { render, roots } from '../render';
import { removeContent } from '../utils';

function createRoot(container: TagNativeElement) {
  return {
    render: (element: DarkElement) => render(element, container),
    unmount: () => unmount(container),
  };
}

function unmount(container: TagNativeElement) {
  const rootId = roots.get(container);

  unmountRoot(rootId);
  roots.delete(container);
  removeContent(container);
}

export { createRoot, unmount };
