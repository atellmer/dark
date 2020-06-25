const dom = (strings: TemplateStringsArray, ...args: Array<string | number>) => {
  const markup =  strings
    .map((x, idx) => x + (args[idx] || ''))
    .join('')
    .replace(/\s*(?=\<).*?\s*/gm, '')
    .trim();

  return markup;
}

export {
  dom,
};
