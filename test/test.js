'use strict';

let pick = require('../index');

// ファイル名にドット含まれる場合
pick('list-1.0.1.txt', {
  prefix: 'release@'
});
// -> release@list-1.0.1/~


// ファイル名に拡張子がなくドットが含まれる場合
pick('1.0.1.txt', {
  prefix: 'release@'
});
// -> release@1.0.1/~
