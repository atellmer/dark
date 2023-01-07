const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/platform-native/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/platform-native/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/platform-native/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/platform-native');
shell.rm('-rf', 'dist/cjs/platform-native');
shell.rm('-rf', 'dist/types/platform-native');
