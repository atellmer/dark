import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

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
  '@dark-engine/styled': resolve(__dirname, './packages/styled/src'),
};
const plugins = [
  new webpack.IgnorePlugin({
    checkResource(resource) {
      return resource === './server/sheet';
    },
  }),
];

export { alias, plugins };