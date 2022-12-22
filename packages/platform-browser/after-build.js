const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/platform-browser/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/platform-browser/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/platform-browser/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/platform-browser');
shell.rm('-rf', 'dist/cjs/platform-browser');
shell.rm('-rf', 'dist/types/platform-browser');
