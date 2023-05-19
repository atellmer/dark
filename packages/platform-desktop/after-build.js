const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/platform-desktop/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/platform-desktop/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/platform-desktop/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/platform-desktop');
shell.rm('-rf', 'dist/cjs/platform-desktop');
shell.rm('-rf', 'dist/types/platform-desktop');
