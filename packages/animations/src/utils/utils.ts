const time = () => performance.now();

const fix = (x: number, precision = 4) => Number(x.toFixed(precision));

const illegal = (value: string) => {
  throw new Error(value);
};

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

export { time, fix, illegal, range, uniq };
