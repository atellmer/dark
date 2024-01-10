import { detectIsObject, detectIsFunction } from '@dark-engine/core';
import { type Container } from '../shared';

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

export { capitalize, createSetterName, detectisValidURL, throwUnsupported, detectIsContainer };
