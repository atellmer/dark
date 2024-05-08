import { illegalFromPackage as $illegalFromPackage } from '@dark-engine/core';

import { LIB } from '../constants';

const illegalFromPackage = (x: string) => $illegalFromPackage(LIB, x);

const stringify = (x: unknown) => JSON.stringify(x);

export { illegalFromPackage, stringify };
