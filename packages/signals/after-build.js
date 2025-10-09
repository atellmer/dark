const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/signals/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/signals/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/signals/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/signals');
shell.rm('-rf', 'dist/cjs/signals');
shell.rm('-rf', 'dist/types/signals');
