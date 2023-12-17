const uniq = <T>(items: Array<T>, selector: (x: T) => unknown = x => x) => {
  const arr: Array<T> = [];
  const set = new Set();

  for (const item of items) {
    const key = selector(item);

    !set.has(key) && arr.push(item);
    set.add(key);
  }

  return arr;
};

export { uniq };
