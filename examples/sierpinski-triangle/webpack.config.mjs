import { resolve, dirname, join } from 'path';

import { alias } from '../../webpack.alias.mjs';

const __dirname = resolve(dirname(''));
const config = {
  mode: process.env.NODE_ENV,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  externals: {
    'node:worker_threads': 'commonjs2 node:worker_threads',
  },
  devtool: 'source-map',
  entry: resolve(__dirname, './index.tsx'),
  output: {
    path: resolve(__dirname, './'),
    filename: 'build.js',
  },
  devServer: {
    static: join(__dirname, './'),
    compress: false,
    port: 9000,
  },
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

export default config;
