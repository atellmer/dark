import { illegal as $illegal } from '@dark-engine/core';

import { LIB } from '../constants';

const fix = (x: number, precision = 4) => Number(x.toFixed(precision));

const range = (x: number) =>
  Array(x)
    .fill(null)
    .map((_, idx) => idx);

const uniq = <T>(items: Array<T>, selector: (x: T) => unknown) => {
  const arr: Array<T> = [];
  const set = new Set();

  for (const item of items) {
    const key = selector(item);

    !set.has(key) && arr.push(item);
    set.add(key);
  }

  return arr;
};

const illegal = (x: string) => $illegal(x, LIB);

export { fix, range, uniq, illegal };
