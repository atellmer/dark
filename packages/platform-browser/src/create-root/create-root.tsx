import { type DarkElement, unmountRoot } from '@dark-engine/core';
import { render, roots } from '../render';
import { resetNodeCache } from '../dom';

function createRoot(container: Element) {
  return {
    render: (element: DarkElement) => render(element, container),
    unmount: () => {
      const rootId = roots.get(container);

      unmountRoot(rootId, () => {
        resetNodeCache();
        roots.delete(container);
        container.innerHTML = '';
      });
    },
  };
}

export { createRoot };
