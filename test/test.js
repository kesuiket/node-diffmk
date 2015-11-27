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


// ファイルリストが他のディレクトリ下にある場合
pick('note/list-1.0.1.txt', {
  prefix: 'note@'
});

// -> note@list-1.0.1/~
