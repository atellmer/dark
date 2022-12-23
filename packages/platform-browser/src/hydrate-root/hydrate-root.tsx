import { type DarkElement } from '@dark-engine/core';
import { render } from '../render';
import { unmount } from '../create-root';
import type { TagNativeElement } from '../native-element';

function hydrateRoot(container: TagNativeElement, element: DarkElement) {
  render(element, container, true);

  return {
    unmount: () => unmount(container),
  };
}

export { hydrateRoot };
