import { illegal as $illegal } from '@dark-engine/core';

import { LIB } from '../constants';

const illegal = (x: string) => $illegal(x, LIB);

export { illegal };
