const { resolve } = require('path');
const webpack = require('@nativescript/webpack');

module.exports = env => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack
  webpack.chainWebpack(config => {
    config.resolve.extensions.add('.js');
    config.resolve.extensions.add('.ts');
    config.resolve.extensions.add('.tsx');

    config.resolve.alias.set('@dark-engine/core', resolve(__dirname, '../../packages/core/src'));
    config.resolve.alias.set('@dark-engine/platform-native', resolve(__dirname, '../../packages/platform-native/src'));

    config.module
      .rule('ts')
      .test(/\.(ts|tsx)$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        transpileOnly: true,
      });
  });

  return webpack.resolveConfig();
};
