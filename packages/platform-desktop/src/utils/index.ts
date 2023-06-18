import { detectIsObject, detectIsFunction } from '@dark-engine/core';
import { type Container } from '../shared';

function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.substring(1);
}

function createSetterName(value: string) {
  return `set${capitalizeFirstLetter(value)}`;
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
  throw new Error(`Unsupported action in ${value.constructor.name}`);
}

function detectIsContainer(element: unknown): element is Container {
  return (
    element &&
    detectIsObject(element) &&
    detectIsFunction((element as Container).detectIsContainer) &&
    (element as Container).detectIsContainer()
  );
}

export { capitalizeFirstLetter, createSetterName, detectisValidURL, throwUnsupported, detectIsContainer };
