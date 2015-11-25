'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const pwd = process.cwd();
const logfile = 'README.txt';
const def = require('./lib/option');
const make = require('./lib/make');
const confirm = require('./lib/confirm');
const save = require('./lib/save');
const done = require('./lib/done');
const fn = require('./lib/func');

module.exports = (file, opt) => {
  //let timestamp = +(new Date()); // タイムスタンプを保存
  let option = _.merge(def, (opt || {}));
  let filename = fn.addExt(file, '.txt'); // 拡張子付きのファイル名
  let name = filename.replace(/(^[\w\d_-]+)\.(?:[\w\d]+)$/, '$1'); // 拡張子なしのファイル名
  let dest = [option.prefix, name].join(''); // 保存先フォルダ名
  let maker = e(filename, dest, pwd);
  return maker(make, confirm, save, done);
};


function e(file, dest, cwd) {
  return (make, confirm, save, done) => {
    make(file, cwd, (list) => {
      if (confirm(list)) {
        return save(list, dest, cwd, done);
      } else {
        return console.error('ERROR: filelist');
      }
    });
  }
}



/*
 * Done
 * @param {String} log
 * @param {String} dest
 * @return {Object} console.log
 */
function clearner(log, dest) {
  return function() {
    // ファイルリストを README として保存先フォルダに出力
    makeFile(log, path.join(dest, logfile));
    return console.log('[ Completed! ]');
  };
}
