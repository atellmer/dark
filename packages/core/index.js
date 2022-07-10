'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./umd/dark-core.production.min.js');
} else {
  module.exports = require('./umd/dark-core.development.js');
}
