const path = require('path');
const webpack = require('webpack');

const { alias } = require('../../webpack.alias');

const config = {
  mode: 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, './index.tsx'),
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'build.js',
  },
  devServer: {
    contentBase: path.join(__dirname, './'),
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};

module.exports = config;
