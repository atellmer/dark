'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./umd/dark-platform-browser.production.min.js');
} else {
  module.exports = require('./umd/dark-platform-browser.development.js');
}
