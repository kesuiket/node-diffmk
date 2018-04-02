'use strict';

const cwd = process.cwd()
const _ = require('lodash')
const path = require('path')
const defaults = require('./lib/option')
const init = require('./lib/init')
const make = require('./lib/make')
const confirm = require('./lib/confirm')
const save = require('./lib/save')
const done = require('./lib/done')

/**
 * @param {String} listFile
 * @param {Object} customize
 * @return {Function}
 */
module.exports = (listFile, customize = {}) => {
  const options = _.merge({}, defaults, (customize))
  const filename = path.basename(listFile, '.txt')
  const dest = path.join([options.prefix, filename].join(''))
  const api = init(listFile, dest, cwd, options.savedir)

  return api(make, confirm, save, done(filename))
};
