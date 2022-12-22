const path = require('path');
const webpack = require('webpack');

const { alias } = require('../../webpack.alias');

const config = {
  mode: 'production',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {
      assert: require.resolve('assert'),
    },
    alias,
  },
  performance: {
    maxEntrypointSize: 307200,
    maxAssetSize: 307200,
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, './index.tsx'),
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'build.js',
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
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

module.exports = config;
