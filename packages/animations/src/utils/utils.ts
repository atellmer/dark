const time = () => performance.now();

const fix = (x: number, precision = 4) => Number(x.toFixed(precision));

const illegal = (value: string) => {
  throw new Error(value);
};

function getFirstKey<T extends object>(value: T) {
  const [key] = Object.keys(value);

  return key;
}

const range = (x: number) =>
  Array(x)
    .fill(null)
    .map((_, idx) => idx);

export { time, fix, illegal, getFirstKey, range };
