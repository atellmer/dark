import { resolve, dirname } from 'node:path';

import { alias } from '../../webpack.common.mjs';

const __dirname = resolve(dirname(''));
const library = 'DarkCore';
const libraryNameKebabCase = 'dark-core';
const config = env => ({
  mode: env.production ? 'production' : 'development',
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  entry: resolve(__dirname, 'src/index.ts'),
  output: {
    path: resolve(__dirname, 'dist/umd'),
    filename: env.production ? `${libraryNameKebabCase}.production.min.js` : `${libraryNameKebabCase}.development.js`,
    library: library,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
});

export default config;
