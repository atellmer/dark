const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/animations/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/animations/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/animations/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/animations');
shell.rm('-rf', 'dist/cjs/animations');
shell.rm('-rf', 'dist/types/animations');
