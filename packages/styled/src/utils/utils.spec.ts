import { uniq } from './utils';

describe('[@styled/utils]', () => {
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
});
