import { resolve, dirname } from 'node:path';

import { alias } from '../../webpack.common.mjs';

const __dirname = resolve(dirname(''));
const libraryName = 'DarkStyled';
const libraryNameKebabCase = 'dark-styled';
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
  entry: resolve(__dirname, 'src/index.ts'),
  output: {
    path: resolve(__dirname, 'dist/umd'),
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
});

export default config;
