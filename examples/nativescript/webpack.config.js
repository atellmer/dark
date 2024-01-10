const webpack = require('@nativescript/webpack');
const { merge } = require('webpack-merge');

module.exports = env => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack
  webpack.chainWebpack(config => {
    config.resolve.extensions.add('.android.ts');
    config.resolve.extensions.add('.ios.ts');
    config.resolve.extensions.add('.ts');
    config.resolve.extensions.add('.android.tsx');
    config.resolve.extensions.add('.ios.tsx');
    config.resolve.extensions.add('.tsx');

    config.module
      .rule('ts')
      .test(/\.(ts|tsx)$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        transpileOnly: true,
      });

    config.plugin('DefinePlugin').tap(args => {
      args[0] = merge(args[0], {
        __UI_USE_EXTERNAL_RENDERER__: true,
        __UI_USE_XML_PARSER__: false,
      });

      return args;
    });
  });

  const config = webpack.resolveConfig();

  return config;
};
