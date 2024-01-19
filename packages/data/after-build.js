const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/data/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/data/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/data/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/data');
shell.rm('-rf', 'dist/cjs/data');
shell.rm('-rf', 'dist/types/data');
