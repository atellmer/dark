const shell = require('shelljs');

shell.rm('-rf', 'types/core');
shell.cp('-R', ' types/platform-browser/src/*', 'types');
shell.rm('-rf', ' types/platform-browser');
