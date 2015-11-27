'use strict';

const exec = require('child_process').exec;
const path = require('path');

/*
 * Make List
 * テキストのファイルリストを改行で区切って配列を作成する
 * 作成した配列をコールバック関数に渡す
 * @param {String} blueprint
 * @param {String} cwd
 * @param {Function} callback
 */
module.exports = (blueprint, cwd, callback) => {
  exec('cat ' + blueprint, (error, stdout, stderr) => {
    let list = stdout.replace(/[\s\n]+$/, '').split(/\n/);
    let relatives = list.map(file => path.relative(cwd, file.trim()));
    return callback && callback(relatives);
  });
};
