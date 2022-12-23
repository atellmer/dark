import { type DarkElement, unmountRoot, isHydrateZone } from '@dark-engine/core';
import { render, roots } from '../render';

function createRoot(container: Element) {
  return {
    render: (element: DarkElement) => render(element, container),
    hydrate: (element: DarkElement) => render(element, container, true),
    unmount: () => {
      const rootId = roots.get(container);

      unmountRoot(rootId, () => {
        roots.delete(container);
        container.innerHTML = '';
      });
    },
  };
}

export { createRoot };
