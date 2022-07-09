const { resolve } = require('path');

const alias = {
  '@dark/core': resolve(__dirname, './src/core'),
  '@dark/platform-browser': resolve(__dirname, './src/platform/browser'),
};

module.exports = {
  alias,
};
