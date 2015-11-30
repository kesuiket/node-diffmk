'use strict';

let pick = require('../index');

// ファイル名にドット含まれる場合
// release@list-1.0.1/~
pick('list-1.0.1.txt', {
  prefix: 'release@',
  savedir: 'pkg'
});


// ファイル名に拡張子がなくドットが含まれる場合
// release@1.0.1/~
pick('1.0.1.txt', {
  prefix: 'release@'
});


// ファイルリストが他のディレクトリ下にある場合
// note@list-1.0.1/~
pick('note/list-1.0.1.txt', {
  prefix: 'note@'
});


// 存在しないファイルへのパスが含まれている場合（エラー）
// note@list-1.0.1/~
pick('non-exists.txt', {
  prefix: 'error@'
});
