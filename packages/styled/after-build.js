const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/styled/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/styled/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/styled/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/styled');
shell.rm('-rf', 'dist/cjs/styled');
shell.rm('-rf', 'dist/types/styled');
