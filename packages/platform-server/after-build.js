const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/platform-server/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/platform-server/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/platform-server/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/platform-server');
shell.rm('-rf', 'dist/cjs/platform-server');
shell.rm('-rf', 'dist/types/platform-server');
