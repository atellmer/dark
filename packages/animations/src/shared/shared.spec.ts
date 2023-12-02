import { defaultSpringConfig } from './shared';

describe('[@animations/shared]', () => {
  test('the default config defined correctly', () => {
    expect(defaultSpringConfig).toBeDefined();
    expect(defaultSpringConfig).toEqual({ mass: 1, tension: 170, friction: 26, precision: 3, fix: 4 });
  });
});
