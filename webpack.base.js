const { resolve } = require('node:path');
const webpack = require('webpack');

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
  '@dark-engine/data': resolve(__dirname, './packages/data/src'),
};
const plugins = [
  new webpack.IgnorePlugin({
    checkResource(resource) {
      return resource === './server/sheet';
    },
  }),
];

module.exports = { alias, plugins };
