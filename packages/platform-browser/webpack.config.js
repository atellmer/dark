const path = require('path');
const webpack = require('webpack');

const { alias } = require('../../webpack.alias');

const library = 'DarkPlatformBrowser';
const config = env => ({
  externals: {
    '@dark-engine/core': {
      root: 'DarkCore',
      commonjs2: '@dark-engine/core',
      commonjs: '@dark-engine/core',
      amd: '@dark-engine/core',
    },
  },
  mode: env.production ? 'production' : 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: env.production ? `browser.prod.umd.min.js` : `browser.dev.umd.js`,
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
