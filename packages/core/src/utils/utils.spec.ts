import {
  detectIsFunction,
  detectIsUndefined,
  detectIsNumber,
  detectIsString,
  detectIsTextBased,
  detectIsObject,
  detectIsBoolean,
  detectIsArray,
  detectIsNull,
  detectIsEmpty,
  detectIsFalsy,
  getTime,
  dummyFn,
  trueFn,
  falseFn,
  error,
  flatten,
  keyBy,
  detectAreDepsDifferent,
  nextTick,
  createIndexKey,
  mapRecord,
} from './utils';

const TIME = 1705647402757;

jest.spyOn(Date, 'now').mockImplementation(() => TIME);

describe('@core/utils', () => {
  test('the detectIsFunction function works correctly', () => {
    expect(typeof detectIsFunction).toBe('function');
    expect(detectIsFunction(() => {})).toBe(true);
    expect(detectIsFunction(null)).toBe(false);
    expect(detectIsFunction(1)).toBe(false);
  });

  test('the detectIsUndefined function works correctly', () => {
    expect(typeof detectIsUndefined).toBe('function');
    expect(detectIsUndefined(undefined)).toBe(true);
    expect(detectIsUndefined(null)).toBe(false);
  });

  test('the detectIsNumber function works correctly', () => {
    expect(typeof detectIsNumber).toBe('function');
    expect(detectIsNumber(1)).toBe(true);
    expect(detectIsNumber('1')).toBe(false);
  });

  test('the detectIsString function works correctly', () => {
    expect(typeof detectIsString).toBe('function');
    expect(detectIsString('a')).toBe(true);
    expect(detectIsString(1)).toBe(false);
  });

  test('the detectIsTextBased function works correctly', () => {
    expect(typeof detectIsTextBased).toBe('function');
    expect(detectIsTextBased('a')).toBe(true);
    expect(detectIsTextBased(1)).toBe(true);
    expect(detectIsTextBased(undefined)).toBe(false);
  });

  test('the detectIsObject function works correctly', () => {
    expect(typeof detectIsObject).toBe('function');
    expect(detectIsObject({})).toBe(true);
    expect(detectIsObject('a')).toBe(false);
  });

  test('the detectIsBoolean function works correctly', () => {
    expect(typeof detectIsBoolean).toBe('function');
    expect(detectIsBoolean(true)).toBe(true);
    expect(detectIsBoolean(false)).toBe(true);
    expect(detectIsBoolean('a')).toBe(false);
  });

  test('the detectIsArray function works correctly', () => {
    expect(typeof detectIsArray).toBe('function');
    expect(detectIsArray([])).toBe(true);
    expect(detectIsArray('a')).toBe(false);
  });

  test('the detectIsNull function works correctly', () => {
    expect(typeof detectIsNull).toBe('function');
    expect(detectIsNull(null)).toBe(true);
    expect(detectIsNull('a')).toBe(false);
  });

  test('the detectIsEmpty function works correctly', () => {
    expect(typeof detectIsEmpty).toBe('function');
    expect(detectIsEmpty(null)).toBe(true);
    expect(detectIsEmpty(undefined)).toBe(true);
    expect(detectIsEmpty(0)).toBe(false);
    expect(detectIsEmpty('')).toBe(false);
    expect(detectIsEmpty('a')).toBe(false);
  });

  test('the detectIsFalsy function works correctly', () => {
    expect(typeof detectIsFalsy).toBe('function');
    expect(detectIsFalsy(null)).toBe(true);
    expect(detectIsFalsy(undefined)).toBe(true);
    expect(detectIsFalsy(false)).toBe(true);
    expect(detectIsFalsy(0)).toBe(false);
    expect(detectIsFalsy('')).toBe(false);
    expect(detectIsFalsy('a')).toBe(false);
  });

  test('the dummyFn function works correctly', () => {
    expect(typeof dummyFn).toBe('function');
    expect(typeof dummyFn()).toBe('undefined');
  });

  test('the trueFn function works correctly', () => {
    expect(typeof trueFn).toBe('function');
    expect(trueFn()).toBe(true);
  });

  test('the falseFn function works correctly', () => {
    expect(typeof falseFn).toBe('function');
    expect(falseFn()).toBe(false);
  });

  test('the flatten function works correctly', () => {
    expect(typeof flatten).toBe('function');
    expect(flatten([])).toEqual([]);
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    expect(flatten([1, 2, 3, [4, [5, [6, 7, [8]]]]])).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('the keyBy function works correctly', () => {
    const data = [
      { a: 1, b: 2 },
      { a: 10, b: 20 },
    ];
    expect(typeof keyBy).toBe('function');
    expect(keyBy(data, x => x.a)).toEqual({
      1: true,
      10: true,
    });
    expect(keyBy(data, x => x.a, true)).toEqual({
      1: data[0],
      10: data[1],
    });
  });

  test('the detectAreDepsDifferent function works correctly', () => {
    expect(typeof detectAreDepsDifferent).toBe('function');
    expect(detectAreDepsDifferent([], [])).toBe(false);
    expect(detectAreDepsDifferent([1, 2, 3], [1, 2, 3])).toBe(false);
    expect(detectAreDepsDifferent([1, 2, 3], [1, 2, 3, 4])).toBe(true);
    expect(detectAreDepsDifferent([1, 2, 3, 4], [1, 2, 3])).toBe(true);
    expect(detectAreDepsDifferent([{}, 2, 3], [{}, 2, 3])).toBe(true);
  });

  test('the getTime function works correctly', () => {
    expect(typeof getTime).toBe('function');
    expect(getTime()).toBe(TIME);
  });

  test('the error function works correctly', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());

    expect(typeof error).toBe('function');
    error('Error!');
    expect(spy).toHaveBeenCalledWith('Error!');
    spy.mockRestore();
  });

  test('the createIndexKey function works correctly', () => {
    expect(typeof createIndexKey).toBe('function');
    expect(createIndexKey(10).indexOf('10') !== -1).toBe(true);
  });

  test('the nextTick function works correctly', async () => {
    const spy = jest.fn();

    await nextTick(spy);
    expect(spy).toHaveBeenCalled();
  });

  test('the mapRecord function works correctly', () => {
    expect(typeof mapRecord).toBe('function');
    expect(mapRecord({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3]);
    expect(mapRecord({ a: {}, b: [], c: '3' })).toEqual([{}, [], '3']);
  });
});
