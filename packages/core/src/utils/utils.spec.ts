import { mapRecord } from './utils';

describe('@core/utils', () => {
  test('the mapRecord function works correctly', () => {
    expect(typeof mapRecord).toBe('function');
    expect(mapRecord({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3]);
    expect(mapRecord({ a: {}, b: [], c: '3' })).toEqual([{}, [], '3']);
  });
});
