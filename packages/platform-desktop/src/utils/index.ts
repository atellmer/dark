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

export { capitalizeFirstLetter, createSetterName, detectisValidURL, throwUnsupported };
