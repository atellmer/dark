const { resolve } = require('path');

module.exports = env => {
  const config = {
    mode: env.production ? 'production' : 'development',
    entry: ['./src/index.tsx'],
    target: 'node',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: 'index.js',
      clean: true,
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
  };

  return config;
};
