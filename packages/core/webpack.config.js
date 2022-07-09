const path = require('path');
const webpack = require('webpack');

const { alias } = require('../../webpack.alias');

const library = 'DarkCore';
const config = env => ({
  mode: env.production ? 'production' : 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: env.production ? `core.prod.umd.min.js` : `core.dev.umd.js`,
    library: library,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
  ],
});

module.exports = config;
