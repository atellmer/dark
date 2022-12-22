import { resolve, dirname } from 'path';
import webpack from 'webpack';
import { createRequire } from 'node:module';

import { alias } from '../../webpack.alias.mjs';

const require$ = createRequire(import.meta.url);
const package$ = require$('./package.json');
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': env.production ? JSON.stringify('production') : JSON.stringify('development'),
      'process.env.VERSION': JSON.stringify(package$.version),
    }),
  ],
});

export default config;
