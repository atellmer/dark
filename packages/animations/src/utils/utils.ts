const time = () => performance.now();

const fix = (x: number, precision = 4) => Number(x.toFixed(precision));

export { time, fix };
