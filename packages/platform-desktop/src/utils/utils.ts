import { detectIsObject, detectIsFunction, illegal as $illegal } from '@dark-engine/core';

import { type Container } from '../shared';
import { LIB } from '../constants';

function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0).toUpperCase() + value.substring(1)) as Capitalize<T>;
}

function createSetterName<T extends string>(value: T): `set${Capitalize<T>}` {
  return `set${capitalize(value)}`;
}

function detectisValidURL(value: string) {
  try {
    const url = new URL(value);

    return url.protocol.startsWith('http');
  } catch (error) {
    return false;
  }
}

function throwUnsupported(value: object) {
  console.warn(`Unsupported action in ${value.constructor.name}`);
}

function detectIsContainer(element: unknown): element is Container {
  const container = element as Container;

  return (
    element && detectIsObject(element) && detectIsFunction(container.detectIsContainer) && container.detectIsContainer()
  );
}

const illegal = (x: string) => $illegal(x, LIB);

export { capitalize, createSetterName, detectisValidURL, throwUnsupported, detectIsContainer, illegal };
