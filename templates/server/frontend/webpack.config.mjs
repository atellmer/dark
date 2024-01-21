import { resolve, dirname } from 'node:path';
import CopyPlugin from 'copy-webpack-plugin';

const __dirname = resolve(dirname(''));
const config = env => ({
  mode: env.production ? 'production' : 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
  },
  entry: resolve(__dirname, './index.tsx'),
  output: {
    path: resolve(__dirname, './static'),
    filename: 'build.js',
    clean: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: env.development,
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './assets', to: './assets' }],
    }),
  ],
});

export default config;
