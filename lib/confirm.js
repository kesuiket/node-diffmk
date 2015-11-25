'use strict';

const fs = require('fs');

/*
 * Confirm
 * Exec 前の事前チェック
 * - ファイルリストで指定されたパスにファイルが存在しているかを確認します
 * - 1つでも存在しないファイルがあれば、`false` を返す
 * @param {Array} list
 * @return {Boolean}
 */
module.exports = list => {
  let tmp = [];
  let errors = false;

  list.map(a => {
    try {
      fs.openSync(a, 'r');
    } catch (e) {
      errors = true;
      tmp.push(a);
    }
  });

  if (errors) {
    console.error('存在しないファイルが指定されています');
    console.error(tmp.join('\n'));
  }

  return !errors;
};
