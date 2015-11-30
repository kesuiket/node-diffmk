'use strict';

const fs = require('fs');

/*
 * Confirm
 * 事前チェック
 * - 指定されたパスにファイルが存在しているかを確認します
 * - 1つでも存在しないファイルがあれば、`false` を返します
 * @param {Array} plan
 * @return {Boolean}
 */
module.exports = plan => {
  let errors = [];
  plan.forEach(item => {
    try {
      fs.openSync(item, 'r');
    } catch (e) {
      errors.push('> ' + item);
    }
  });

  if (errors && errors.length > 0) {
    console.error('It contains a non-existent file.');
    console.error(errors.join('\n'));
    console.error('Aborted the program.');
    console.log('');
    return false;
  }

  return true;
};
