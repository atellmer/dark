import { resolve, dirname, join } from 'node:path';

import { alias } from '../../webpack.common.mjs';

const __dirname = resolve(dirname(''));
const config = {
  mode: 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
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
    historyApiFallback: true,
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
