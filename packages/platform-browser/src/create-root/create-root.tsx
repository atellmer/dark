import { type DarkElement, unmountRoot } from '@dark-engine/core';
import { type RenderOptions, render, roots } from '../render';

function createRoot(container: Element) {
  return {
    render: (element: DarkElement, options?: RenderOptions) => {
      render(element, container, options);
    },
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
