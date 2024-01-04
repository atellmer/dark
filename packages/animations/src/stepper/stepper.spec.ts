import { stepper } from './stepper';
import { type SpringConfig } from '../shared';

const step = 0.01;
const config: Omit<SpringConfig, 'fix'> = {
  mass: 1,
  tension: 170,
  friction: 26,
  precision: 2,
};

describe('@animations/stepper', () => {
  test('calculates spring motion correctly', () => {
    const dest = 1;
    let pos = 0;
    let vel = 0;

    [pos, vel] = stepper(pos, vel, dest, step, config);
    expect(pos).toBe(0.017);
    expect(vel).toBe(1.7);

    [pos, vel] = stepper(pos, vel, dest, step, config);
    expect(pos).toBe(0.046291);
    expect(vel).toBe(2.9291);

    [pos, vel] = stepper(pos, vel, dest, step, config);
    expect(pos).toBe(0.084179393);
    expect(vel).toBe(3.7888393000000002);

    for (let i = 0; i < 20; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(0.8105400162969808);
    expect(vel).toBe(1.8238058117993077);

    for (let i = 0; i < 50; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(dest);
    expect(vel).toBe(0);
  });

  test('ensures convergence #1', () => {
    const dest = 10;
    let pos = 0;
    let vel = 0;

    for (let i = 0; i < 20; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(7.5079785038458615);

    for (let i = 0; i < 100; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(dest);
  });

  test('ensures convergence #2', () => {
    const dest = -10;
    let pos = 0;
    let vel = 0;

    for (let i = 0; i < 20; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(-7.5079785038458615);

    for (let i = 0; i < 100; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(dest);
  });

  test('ensures convergence #3', () => {
    const dest = 0;
    let pos = 10;
    let vel = 0;

    for (let i = 0; i < 20; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(2.492021496154139);

    for (let i = 0; i < 100; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(dest);
  });

  test('ensures convergence #4', () => {
    const dest = 0;
    let pos = -10;
    let vel = 0;

    for (let i = 0; i < 20; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(-2.492021496154139);

    for (let i = 0; i < 100; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(dest);
  });

  test('ensures convergence #5', () => {
    const dest = 1.02;
    let pos = -0.05;
    let vel = 0;

    for (let i = 0; i < 20; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(0.7533536999115071);

    for (let i = 0; i < 100; i++) {
      [pos, vel] = stepper(pos, vel, dest, step, config);
    }

    expect(pos).toBe(dest);
  });
});
