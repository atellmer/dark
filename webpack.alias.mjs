import { resolve, dirname } from 'path';

const __dirname = resolve(dirname(''));
const alias = {
  '@dark-engine/core': resolve(__dirname, './packages/core/src'),
  '@dark-engine/platform-browser': resolve(__dirname, './packages/platform-browser/src'),
};

export { alias };
