/** @jsx h */
import { createRouterLocation } from './location';

describe('[router/location]', () => {
  test('throws error when incorrect initialization occurs', () => {
    expect(() => createRouterLocation(null)).toThrowError();
  });

  test('can parse url correctly', () => {
    const { url, protocol, host, pathname, search, key } = createRouterLocation(
      'https://www.google.com/search/route/?q="hello"&p="world"',
    );

    expect(url).toBe('https://www.google.com/search/route/?q="hello"&p="world"');
    expect(protocol).toBe('https');
    expect(host).toBe('www.google.com');
    expect(pathname).toBe('/search/route/');
    expect(search).toBe('?q="hello"&p="world"');
    expect(key).toBe('63a1');
  });
});
