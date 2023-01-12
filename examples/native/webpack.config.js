const { resolve } = require('path');
const webpack = require('@nativescript/webpack');

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

    config.resolve.alias.set('@dark-engine/core', resolve(__dirname, '../../packages/core/src'));
    config.resolve.alias.set('@dark-engine/platform-native', resolve(__dirname, '../../packages/platform-native/src'));
    config.resolve.alias.set(
      '@nativescript/core',
      resolve(__dirname, '../../packages/platform-native/node_modules/@nativescript/core'),
    );

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
