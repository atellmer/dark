import { resolve, dirname } from 'node:path';
import { InjectManifest } from 'workbox-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import { alias } from '../../../webpack.common.mjs';

const __dirname = resolve(dirname(''));
const config = env => ({
  mode: env.production ? 'production' : 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  entry: resolve(__dirname, './index.tsx'),
  output: {
    path: resolve(__dirname, './static'),
    filename: 'build.js',
    clean: true,
  },
  devtool: 'source-map',
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
    new CopyPlugin({
      patterns: [{ from: './assets', to: './assets' }],
    }),
    new InjectManifest({
      swSrc: './service-worker.ts',
      modifyURLPrefix: {
        '': '/static/',
      },
    }),
  ],
});

export default config;
