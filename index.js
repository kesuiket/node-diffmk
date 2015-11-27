'use strict';

const _ = require('lodash');
const cwd = process.cwd();
const defalts = require('./lib/option');
const init = require('./lib/init');
const make = require('./lib/make');
const confirm = require('./lib/confirm');
const save = require('./lib/save');
const done = require('./lib/done');
const ext = require('./lib/extname');

module.exports = (blueprint, customize) => {
  let option = _.merge(defalts, (customize || {}));
  let name = ext(blueprint).rm(); // 拡張子を除外した名前
  let dest = [option.prefix, name].join(''); // 保存先フォルダ名
  let api = init(blueprint, dest, cwd);

  return api(make, confirm, save, done);
};
