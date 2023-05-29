function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.substring(1);
}

function createSetterName(value: string) {
  return `set${capitalizeFirstLetter(value)}`;
}

export { capitalizeFirstLetter, createSetterName };
