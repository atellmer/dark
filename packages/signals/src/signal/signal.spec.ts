import { signal } from './signal';

describe('@signals/signal', () => {
  test('signal has required public methods', () => {
    const signal$ = signal(0);

    expect(signal$.get).toBeDefined();
    expect(signal$.peek).toBeDefined();
    expect(signal$.set).toBeDefined();
    expect(signal$.toString).toBeDefined();
    expect(signal$.toJSON).toBeDefined();
    expect(signal$.valueOf).toBeDefined();
  });

  test('signal gives the correct value', () => {
    const signal$ = signal(10);

    expect(signal$.get()).toBe(10);
    expect(signal$.peek()).toBe(10);
    signal$.set(20);
    expect(signal$.get()).toBe(20);
    expect(signal$.peek()).toBe(20);
    signal$.set(x => x + 10);
    expect(signal$.get()).toBe(30);
    expect(signal$.peek()).toBe(30);
  });

  test('signal transforms to primitive value correctly', () => {
    const signal$ = signal(10);

    expect(`signal is ${signal$}`).toBe('signal is 10');
    expect(Number(signal$)).toBe(10);
    expect(JSON.stringify(signal$)).toBe('10');
  });
});
