import { time, fix, illegal, range, uniq } from './utils';

jest.spyOn(performance, 'now').mockImplementation(() => 12345);

describe('[@animations/utils]', () => {
  test('the time function works correctly', () => {
    expect(typeof time).toBe('function');
    expect(time()).toBe(12345);
    expect(time()).toBe(12345);
  });
  test('the fix function works correctly', () => {
    expect(typeof fix).toBe('function');
    expect(fix(-0.123456)).toBe(-0.1235);
    expect(fix(0)).toBe(0);
    expect(fix(1)).toBe(1);
    expect(fix(0.123456)).toBe(0.1235);
    expect(fix(0.123456, 2)).toBe(0.12);
    expect(fix(10.123456, 0)).toBe(10);
  });
  test('the illegal function works correctly', () => {
    expect(typeof illegal).toBe('function');
    expect(() => illegal('ohh')).toThrowError('ohh');
  });
  test('the range function works correctly', () => {
    expect(typeof range).toBe('function');
    expect(range(0)).toEqual([]);
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(() => range(-1)).toThrowError();
  });
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
