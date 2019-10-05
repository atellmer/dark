const path = require('path');

const { alias } = require('./webpack.alias');

const config = {
  mode: 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts'],
    alias,
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'app/index.ts'),
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'build.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'app'),
    compress: false,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [],
};

module.exports = config;
