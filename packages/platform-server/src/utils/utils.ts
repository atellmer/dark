const voidTagNames = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const detectIsVoidElement = (name: string) => voidTagNames.has(name);

export { detectIsVoidElement };
