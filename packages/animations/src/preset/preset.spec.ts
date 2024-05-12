import { preset } from './preset';

describe('@animations/preset', () => {
  test('works correctly', () => {
    expect(typeof preset).toBe('function');
    expect(preset('no-wobble')).toEqual({ tension: 170, friction: 26 });
    expect(preset('gentle')).toEqual({ tension: 120, friction: 14 });
    expect(preset('wobbly')).toEqual({ tension: 180, friction: 12 });
    expect(preset('stiff')).toEqual({ tension: 210, friction: 20 });
    expect(preset('slow')).toEqual({ tension: 280, friction: 60 });
    expect(preset('molasses')).toEqual({ tension: 280, friction: 120 });
  });
});
