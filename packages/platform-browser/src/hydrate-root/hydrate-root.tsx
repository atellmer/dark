import { type DarkElement, type Resource, STATE_SCRIPT_TYPE, $$scope } from '@dark-engine/core';

import { render } from '../render';
import { unmount } from '../create-root';
import type { TagNativeElement } from '../native-element';
import { illegal } from '../utils';

function hydrateRoot(container: TagNativeElement | Document, element: DarkElement) {
  const tag = container as TagNativeElement;

  render(element, tag, hydrate);

  return {
    unmount: () => unmount(tag),
  };
}

function hydrate() {
  const element = document.querySelector(`script[type="${STATE_SCRIPT_TYPE}"]`);

  if (!element) return;
  try {
    const resources = parse(element.textContent) as Record<string, Resource>;
    const $scope = $$scope();

    for (const key of Object.keys(resources)) {
      $scope.setResource(Number(key), resources[key]);
    }

    element.remove();
  } catch (error) {
    illegal(`Can't hydrate app state from the server!`);
  }
}

const parse = (x: string) => JSON.parse(window.atob(x.replaceAll('"', '')));

export { hydrateRoot };
