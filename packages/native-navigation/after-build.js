const shell = require('shelljs');

shell.rm('-rf', 'dist/esm/core');
shell.rm('-rf', 'dist/cjs/core');
shell.rm('-rf', 'dist/types/core');

shell.cp('-R', 'dist/esm/native-navigation/src/*', 'dist/esm');
shell.cp('-R', 'dist/cjs/native-navigation/src/*', 'dist/cjs');
shell.cp('-R', 'dist/types/native-navigation/src/*', 'dist/types');

shell.rm('-rf', 'dist/esm/native-navigation');
shell.rm('-rf', 'dist/cjs/native-navigation');
shell.rm('-rf', 'dist/types/native-navigation');
