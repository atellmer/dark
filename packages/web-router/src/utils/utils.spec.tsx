/** @jsx h */
import { PARAMETER } from '../constants';
import { parseURL, normalaizeEnd, detectIsParam, getParamName, sort, splitPath, cm } from './utils';

describe('[router/utils]', () => {
  test('parseURL works correctly #1', () => {
    const { protocol, host, pathname, search } = parseURL('https://localhost:9000/search/route/?q="hello"&p="world"');

    expect(protocol).toBe('https');
    expect(host).toBe('localhost:9000');
    expect(pathname).toBe('/search/route/');
    expect(search).toBe('q="hello"&p="world"');
  });

  test('parseURL works correctly #2', () => {
    const { protocol, host, pathname, search } = parseURL('https://www.google.com/search/route/?q="hello"&p="world"');

    expect(protocol).toBe('https');
    expect(host).toBe('www.google.com');
    expect(pathname).toBe('/search/route/');
    expect(search).toBe('q="hello"&p="world"');
  });

  test('parseURL works correctly #3', () => {
    const { protocol, host, pathname, search } = parseURL('https://google.com/search/route/?q="hello"&p="world"');

    expect(protocol).toBe('https');
    expect(host).toBe('google.com');
    expect(pathname).toBe('/search/route/');
    expect(search).toBe('q="hello"&p="world"');
  });

  test('parseURL works correctly #4', () => {
    const { protocol, host, pathname, search } = parseURL('https://localhost:9000');

    expect(protocol).toBe('https');
    expect(host).toBe('localhost:9000');
    expect(pathname).toBe('/');
    expect(search).toBe('');
  });

  test('parseURL works correctly #5', () => {
    const { protocol, host, pathname, search } = parseURL('/');

    expect(protocol).toBe('');
    expect(host).toBe('');
    expect(pathname).toBe('/');
    expect(search).toBe('');
  });

  test('parseURL works correctly #6', () => {
    const { protocol, host, pathname, search } = parseURL('');

    expect(protocol).toBe('');
    expect(host).toBe('');
    expect(pathname).toBe('/');
    expect(search).toBe('');
  });

  test('parseURL works correctly #7', () => {
    const { protocol, host, pathname, search } = parseURL('/some/route');

    expect(protocol).toBe('');
    expect(host).toBe('');
    expect(pathname).toBe('/some/route');
    expect(search).toBe('');
  });

  test('parseURL works correctly #8', () => {
    const { protocol, host, pathname, search } = parseURL('/some/route?q="hello"');

    expect(protocol).toBe('');
    expect(host).toBe('');
    expect(pathname).toBe('/some/route');
    expect(search).toBe('q="hello"');
  });

  test('parseURL works correctly #9', () => {
    const { protocol, host, pathname, search } = parseURL('/#/some/route?q="hello"');

    console.log('protocol', protocol);
    console.log('host', host);
    console.log('pathname', pathname);
    console.log('search', search);

    expect(protocol).toBe('');
    expect(host).toBe('');
    expect(pathname).toBe('/#/some/route');
    expect(search).toBe('q="hello"');
  });

  test('normalaizeEnd works correctly', () => {
    expect(normalaizeEnd('/some/route')).toBe('/some/route/');
    expect(normalaizeEnd('/some/route/')).toBe('/some/route/');
  });

  test('detectIsParam works correctly', () => {
    expect(detectIsParam(`${PARAMETER}id`)).toBe(true);
    expect(detectIsParam(`/${PARAMETER}id`)).toBe(false);
    expect(detectIsParam('id')).toBe(false);
  });

  test('getParamName works correctly', () => {
    expect(getParamName(`${PARAMETER}id`)).toBe('id');
    expect(getParamName(`/${PARAMETER}id`)).toBe(null);
    expect(getParamName('id')).toBe(null);
  });

  test('sort works correctly', () => {
    expect(sort('asc', [10, 5, 2, 4, 20], x => x)).toEqual([2, 4, 5, 10, 20]);
    expect(sort('desc', [10, 5, 2, 4, 20], x => x)).toEqual([20, 10, 5, 4, 2]);
  });

  test('splitPath works correctly', () => {
    expect(splitPath('/some/awesome/url/')).toEqual(['some', 'awesome', 'url']);
    expect(splitPath('/')).toEqual([]);
    expect(splitPath('')).toEqual([]);
    expect(splitPath('some/awesome/url?q="hello"')).toEqual(['some', 'awesome', 'url?q="hello"']);
  });

  test('cm works correctly', () => {
    expect(cm(undefined, 'some', null, '', 'class')).toBe('some class');
  });
});