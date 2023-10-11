import { resolve, dirname, join } from 'path';
import webpack from 'webpack';

import { alias } from '../../webpack.alias.mjs';

const __dirname = resolve(dirname(''));
const config = {
  mode: 'production',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('development'),
    }),
  ],
};

export default config;
