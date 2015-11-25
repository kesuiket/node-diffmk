'use strict';

const exec = require('child_process').exec;
const path = require('path');

/*
 * Make List
 * テキストのファイルリストを改行で区切り配列で返す
 * 空文字の行は除外する
 * @param {String} txt
 * @return {Array}
 */
module.exports = (filename, cwd, callback) => {
  exec('cat ' + filename, (error, stdout, stderr) => {
    let list = stdout.replace(/[\s\n]+$/, '').split(/\n/);
    let relative = list.map((file) => path.relative(cwd, file));
    return callback && callback(relative);
  });
};
