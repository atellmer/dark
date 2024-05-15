import { illegal as $illegal } from '@dark-engine/core';

import { LIB } from '../constants';

const illegal = (x: string) => $illegal(x, LIB);

const escape = (x: string) =>
  x
    .split('')
    .map(x => escapeChar(x))
    .join('');

function escapeChar(x: string) {
  switch (x) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    default:
      return x;
  }
}

export { illegal, escape };
