const { resolve } = require('path');

const alias = {
  '@helpers': resolve(__dirname, './src/helpers'),
};

module.exports = {
  alias,
};
