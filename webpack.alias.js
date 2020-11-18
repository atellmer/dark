const { resolve } = require('path');


const alias = {
  '@helpers': resolve(__dirname, './src/helpers'),
  '@core': resolve(__dirname, './src/core'),
  '@platform': resolve(__dirname, './src/platform'),
  '@test-utils': resolve(_dirname, './test/utils'),
};

module.exports = {
  alias,
};
