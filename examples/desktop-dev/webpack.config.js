const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.NODE_ENV || 'development',
  entry: './src',
  target: 'node',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@dark-engine/core': resolve(__dirname, '../../packages/core/src'),
      '@dark-engine/platform-desktop': resolve(__dirname, '../../packages/platform-desktop/src'),
    },
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: { publicPath: 'dist' },
          },
        ],
      },
      {
        test: /\.node$/,
        use: [
          {
            loader: 'native-addon-loader',
            options: { name: '[name]-[hash].[ext]' },
          },
        ],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};
