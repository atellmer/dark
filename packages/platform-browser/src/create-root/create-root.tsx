import { type DarkElement, unmountRoot } from '@dark-engine/core';

import { render, roots } from '../render';
import type { TagNativeElement } from '../native-element';

function createRoot(container: TagNativeElement) {
  return {
    render: (element: DarkElement) => render(element, container),
    unmount: () => unmount(container),
  };
}

function unmount(container: TagNativeElement) {
  const rootId = roots.get(container);

  unmountRoot(rootId, () => {
    roots.delete(container);
    container.innerHTML = '';
  });
}

export { createRoot, unmount };
