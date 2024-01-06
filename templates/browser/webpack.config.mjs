import { resolve, dirname, join } from 'node:path';
import webpack from 'webpack';

const __dirname = resolve(dirname(''));
const config = {
  mode: process.env.NODE_ENV,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
  },
  devtool: 'source-map',
  entry: resolve(__dirname, './src/index.tsx'),
  output: {
    path: resolve(__dirname, './src'),
    filename: 'build.js',
  },
  devServer: {
    static: join(__dirname, './src'),
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
      'process.env': JSON.stringify(process.env),
    }),
  ],
};

export default config;
