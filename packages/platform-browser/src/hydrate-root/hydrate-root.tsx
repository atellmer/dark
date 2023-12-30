import { type DarkElement, type AppResource, APP_STATE_ATTR, $$scope } from '@dark-engine/core';

import { render } from '../render';
import { unmount } from '../create-root';
import type { TagNativeElement } from '../native-element';

function hydrateRoot(container: TagNativeElement, element: DarkElement) {
  render(element, container, hydrate);

  return {
    unmount: () => unmount(container),
  };
}

function hydrate() {
  const element = document.querySelector(`[${APP_STATE_ATTR}]`);
  if (!element) return;
  try {
    const resources = parse(element.textContent) as Record<string, AppResource>;
    const $scope = $$scope();

    for (const key of Object.keys(resources)) {
      $scope.setResource(Number(key), resources[key]);
    }

    element.remove();
  } catch (error) {
    throw Error('[Dark]: can not hydrate app state from the server!');
  }
}

const parse = (x: string) => JSON.parse(window.atob(x.replaceAll('"', '')));

export { hydrateRoot };
