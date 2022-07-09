const { resolve } = require('path');

const alias = {
  '@dark/core': resolve(__dirname, './packages/core/src'),
  '@dark/platform-browser': resolve(__dirname, './packages/platform-browser/src'),
};

module.exports = {
  alias,
};
