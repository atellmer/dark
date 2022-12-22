const path = require('path');
const webpack = require('webpack');

const package = require('./package.json');
const { alias } = require('../../webpack.alias');

const libraryName = 'DarkPlatformBrowser';
const libraryNameKebabCase = 'dark-platform-browser';
const config = env => ({
  mode: env.production ? 'production' : 'development',
  devtool: 'source-map',
  externals: {
    '@dark-engine/core': {
      root: 'DarkCore',
      commonjs2: '@dark-engine/core',
      commonjs: '@dark-engine/core',
      amd: '@dark-engine/core',
    },
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist/umd'),
    filename: env.production ? `${libraryNameKebabCase}.production.min.js` : `${libraryNameKebabCase}.development.js`,
    library: libraryName,
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
      'process.env.NODE_ENV': env.production ? JSON.stringify('production') : JSON.stringify('development'),
      'process.env.VERSION': JSON.stringify(package.version),
    }),
  ],
});

module.exports = config;
