'use strict';

let pick = require('../index');

// ファイル名にドット含まれる場合
// release@list-1.0.1/~
pick('test/list-1.0.1.txt', {
  prefix: 'release@',
  savedir: 'zip'
});


// ファイル名に拡張子がなくドットが含まれる場合
// release@1.0.1/~
pick('test/1.0.1.txt', {
  prefix: 'release@'
});


// ファイルリストが他のディレクトリ下にある場合
// note@list-1.0.1/~
pick('test/note/list-1.0.1.txt', {
  prefix: 'note@'
});


// 存在しないファイルへのパスが含まれている場合（エラー）
// note@list-1.0.1/~
pick('test/non-exists.txt', {
  prefix: 'error@'
});

// ファイル名の長さをチェック
pick('test/filename-longer.txt', {
  filename_max: 8
})