'use strict';

const _ = require('lodash');
const pwd = process.cwd();
const init = require('./lib/init');
const def = require('./lib/option');
const make = require('./lib/make');
const confirm = require('./lib/confirm');
const save = require('./lib/save');
const done = require('./lib/done');
const fn = require('./lib/func');

module.exports = (file, opt) => {
  let option = _.merge(def, (opt || {}));
  let text = fn.addExt(file, '.txt'); // 拡張子付きのファイル名
  let name = fn.rmExt(text); // 拡張子なしのファイル名
  let dest = [option.prefix, name].join(''); // 保存先フォルダ名
  let api = init(text, dest, pwd);

  return api(make, confirm, save, done);
};
