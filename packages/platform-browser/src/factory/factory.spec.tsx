import { detectIsVirtualNodeFactory, TagVirtualNode } from '@dark-engine/core';

import { factory } from './factory';

describe('@platform-browser/factory', () => {
  test('can create factory', () => {
    const div = factory('div');

    expect(detectIsVirtualNodeFactory(div())).toBe(true);
  });

  test('returns tag correctly', () => {
    const div = factory('div');
    const compiled = div()();

    expect(compiled).toBeInstanceOf(TagVirtualNode);
    expect(compiled.kind).toBe('div');
  });
});
