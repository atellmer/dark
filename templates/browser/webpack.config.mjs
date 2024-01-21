import { resolve, dirname, join } from 'node:path';

const __dirname = resolve(dirname(''));
const config = env => ({
  mode: env.production ? 'production' : 'development',
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
          transpileOnly: env.development,
        },
        exclude: /node_modules/,
      },
    ],
  },
});

export default config;
