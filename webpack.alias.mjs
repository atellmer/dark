import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const alias = {
  '@dark-engine/core': resolve(__dirname, './packages/core/src'),
  '@dark-engine/platform-browser': resolve(__dirname, './packages/platform-browser/src'),
  '@dark-engine/platform-server': resolve(__dirname, './packages/platform-server/src'),
};

export { alias };
