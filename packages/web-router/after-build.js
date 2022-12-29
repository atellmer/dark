const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.rm('-rf', 'dist/esm/platform-browser');
shell.rm('-rf', 'dist/cjs/platform-browser');
shell.rm('-rf', 'dist/types/platform-browser');

shell.cp('-R', 'dist/esm/web-router/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/web-router/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/web-router/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/web-router');
shell.rm('-rf', 'dist/cjs/web-router');
shell.rm('-rf', 'dist/types/web-router');
