import { keyBy } from '@dark-engine/core';

import { VOID_TAG_NAMES } from '../constants';

const voidTagNamesMap = keyBy(VOID_TAG_NAMES.split(','), x => x);

function detectIsVoidElement(tagName: string) {
  return Boolean(voidTagNamesMap[tagName]);
}

export { detectIsVoidElement };
