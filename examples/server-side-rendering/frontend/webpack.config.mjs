import { resolve, dirname } from 'node:path';

import { alias, plugins } from '../../../webpack.base.mjs';

const __dirname = resolve(dirname(''));
const config = {
  mode: process.env.NODE_ENV,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
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
          transpileOnly: process.env.NODE_ENV === 'development',
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [...plugins],
};

export default config;
