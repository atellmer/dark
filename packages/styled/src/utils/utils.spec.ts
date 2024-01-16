import { uniq, mergeClassNames, getElement, createStyleElement, setAttr, append, mergeTemplates } from './utils';

describe('@styled/utils', () => {
  test('the uniq function works correctly', () => {
    expect(typeof uniq).toBe('function');
    expect(uniq([], x => x)).toEqual([]);
    expect(uniq([1, 2, 3], x => x)).toEqual([1, 2, 3]);
    expect(uniq([0, 1, 1, 2, 1, 3, 4], x => x)).toEqual([0, 1, 2, 3, 4]);
    expect(uniq([{ id: 1 }, { id: 2 }, { id: 2 }, { id: 1 }, { id: 3 }], x => x.id)).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  test('the mergeClassNames function works correctly', () => {
    expect(typeof mergeClassNames).toBe('function');
    expect(mergeClassNames(['a', 'b', 'c', 'c', 'a', 'item'])).toBe('a b c item');
  });

  test('the getElement function works correctly', () => {
    expect(typeof getElement).toBe('function');
    expect(getElement('html body')).toBe(document.body);
  });

  test('the createStyleElement function works correctly', () => {
    expect(typeof createStyleElement).toBe('function');
    expect(createStyleElement()).toBeInstanceOf(document.createElement('style').constructor);
  });

  test('the setAttr function works correctly', () => {
    expect(typeof setAttr).toBe('function');

    const element = document.createElement('div');
    const attrName = 'some-attr';
    const attrValue = '123';

    setAttr(element, attrName, attrValue);
    expect(element.getAttribute(attrName)).toBe(attrValue);
  });

  test('the append function works correctly', () => {
    expect(typeof append).toBe('function');

    const parent = document.createElement('div');
    const child = document.createElement('span');

    append(parent, child);
    expect(parent.innerHTML).toBe('<span></span>');
  });

  test('the mergeTemplates function works correctly', () => {
    expect(typeof mergeTemplates).toBe('function');
    const template = (strings: TemplateStringsArray, ...args: Array<any>) => strings;
    const t1 = template`
      color: red;
      background-color: ${'blue'};
    `;
    const t2 = template`
      font-size: ${24}px;
    `;
    const t3 = mergeTemplates(t1, t2);

    expect(JSON.stringify(t3)).toEqual(
      JSON.stringify(['\n      color: red;\n      background-color: ', ';\n    \n      font-size: ', 'px;\n    ']),
    );
    expect(t3.raw).toBeDefined();
  });
});
