'use strict';

const exec = require('child_process').exec;
const path = require('path');
const filter = (item) => {
  if (/^#/.test(item)) {
    return false
  } else if (/^\s+/.test(item) || !item) {
    return false
  }
  return true
}

/*
 * Make List
 * テキストのファイルリストを改行で区切って配列を作成する
 * 作成した配列をコールバック関数に渡す
 * @param {String} listFile
 * @param {String} cwd
 * @param {Function} callback
 */
module.exports = (listFile, cwd, callback) => {
  exec(`cat ${listFile}`, (error, stdout, stderr) => {
    const list = stdout.replace(/[\s\n]+$/gm, '').split(/\n/).filter(filter)
    const relatives = list.map(file => path.relative(cwd, file.trim()))

    return callback && callback(relatives)
  });
};
