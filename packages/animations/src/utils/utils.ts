const time = () => performance.now();

const fix = (x: number, precision = 4) => Number(x.toFixed(precision));

const illegal = (value: string) => {
  throw new Error(value);
};

const range = (x: number) =>
  Array(x)
    .fill(null)
    .map((_, idx) => idx);

export { time, fix, illegal, range };
