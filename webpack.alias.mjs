import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const alias = {
  '@dark-engine/core': resolve(__dirname, './packages/core/src'),
  '@dark-engine/platform-browser': resolve(__dirname, './packages/platform-browser/src'),
  '@dark-engine/platform-server': resolve(__dirname, './packages/platform-server/src'),
  '@dark-engine/platform-native': resolve(__dirname, './packages/platform-native/src'),
  '@dark-engine/platform-desktop': resolve(__dirname, './packages/platform-desktop/src'),
  '@dark-engine/web-router': resolve(__dirname, './packages/web-router/src'),
  '@dark-engine/native-navigation': resolve(__dirname, './packages/native-navigation/src'),
  '@dark-engine/animations': resolve(__dirname, './packages/animations/src'),
};

export { alias };
