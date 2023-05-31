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

export { capitalizeFirstLetter, createSetterName, detectisValidURL };
