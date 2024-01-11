const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.mkdir('dist/__temp__');
shell.mkdir('dist/__temp__/esm');
shell.mkdir('dist/__temp__/cjs');
shell.mkdir('dist/__temp__/types');

shell.cp('-R', 'dist/esm/styled/src/*', 'dist/__temp__/esm');
shell.cp('-R', 'dist/cjs/styled/src/*', 'dist/__temp__/cjs');
shell.cp('-R', 'dist/types/styled/src/*', 'dist/__temp__/types');

shell.rm('-rf', 'dist/esm/styled');
shell.rm('-rf', 'dist/cjs/styled');
shell.rm('-rf', 'dist/types/styled');

shell.cp('-R', 'dist/__temp__/esm/*', 'dist/esm');
shell.cp('-R', 'dist/__temp__/cjs/*', 'dist/cjs');
shell.cp('-R', 'dist/__temp__/types/*', 'dist/types');

shell.rm('-rf', 'dist/__temp__');
