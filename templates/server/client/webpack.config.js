const { resolve } = require('path');

const config = {
  mode: 'production',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@dark-engine/core': resolve(__dirname, '../../../packages/core/src'),
      '@dark-engine/platform-browser': resolve(__dirname, '../../../packages/platform-browser/src'),
      '@dark-engine/web-router': resolve(__dirname, '../../../packages/web-router/src'),
      '@dark-engine/animations': resolve(__dirname, '../../../packages/animations/src'),
      '@dark-engine/styled': resolve(__dirname, '../../../packages/styled/src'),
    },
  },
  entry: resolve(__dirname, './index.tsx'),
  output: {
    path: resolve(__dirname, './static'),
    filename: 'build.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
