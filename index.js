'use strict';

const cwd = process.cwd();
const _ = require('lodash');
const path = require('path');
const defaults = require('./lib/option');
const init = require('./lib/init');
const make = require('./lib/make');
const confirm = require('./lib/confirm');
const save = require('./lib/save');
const done = require('./lib/done');

module.exports = (blueprint, customize) => {

  let option = _.merge({}, defaults, (customize || {}));
  let name = path.basename(blueprint, '.txt');
  let dest = path.join(option.savedir, [option.prefix, name].join(''));
  let api = init(blueprint, dest, cwd);
  return api(make, confirm, save, done);
};
