import { type DarkElement } from '@dark-engine/core';
import { render } from '../render';
import { unmount } from '../create-root';

function hydrateRoot(container: Element, element: DarkElement) {
  render(element, container, true);

  return {
    unmount: () => unmount(container),
  };
}

export { hydrateRoot };
