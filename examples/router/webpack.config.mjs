import path from 'path';
import webpack from 'webpack';
import { createRequire } from 'module';

import { alias } from '../../webpack.alias.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.resolve(path.dirname(''));
const config = {
  mode: 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {
      assert: require.resolve('assert'),
    },
    alias,
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, './index.tsx'),
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'build.js',
  },
  performance: {
    maxEntrypointSize: 307200,
    maxAssetSize: 307200,
  },
  devServer: {
    static: path.join(__dirname, './'),
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};

export default config;
