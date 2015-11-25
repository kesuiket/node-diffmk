'use strict';

const _ = require('lodash');
const pwd = process.cwd();
const def = require('./lib/option');
const make = require('./lib/make');
const confirm = require('./lib/confirm');
const save = require('./lib/save');
const done = require('./lib/done');
const fn = require('./lib/func');

module.exports = (file, opt) => {
  let option = _.merge(def, (opt || {}));
  let filename = fn.addExt(file, '.txt'); // 拡張子付きのファイル名
  let name = fn.rmExt(filename);// 拡張子なしのファイル名
  let dest = [option.prefix, name].join(''); // 保存先フォルダ名
  let maker = api(filename, dest, pwd);
  return maker(make, confirm, save, done);

  function api(file, dest, cwd) {
    return (make, confirm, save, done) => {
      make(file, cwd, (list) => {
        if (confirm(list)) {
          return save(list, dest, cwd, done);
        }
      });
    }
  }
};
