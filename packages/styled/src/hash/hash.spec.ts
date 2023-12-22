import { hash } from './hash';

describe('[@styled/hash]', () => {
  test('works correctly', () => {
    expect(hash('random string 12345')).toBe('fcfagg');
    expect(hash('random string 12345')).toBe('fcfagg');
    expect(hash('random string  12345')).toBe('fhgigh');
    expect(hash('.random string 12345')).toBe('behdcd');
    expect(hash('random string 12345.')).toBe('befdai');
    expect(hash('ran.dom st,ring [] 12{}345.')).toBe('bgbaid');
    expect(hash('')).toBe('fdib');
  });
});
