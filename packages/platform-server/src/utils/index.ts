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

function detectIsVoidElement(tagName: string) {
  return voidTagNames.has(tagName);
}

export { detectIsVoidElement };
