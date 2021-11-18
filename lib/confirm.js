const checkExists = require('./check-exists')
const checkFilename = require('./check-filename')
const checkExtensions = require('./check-extensions')

/*
 * Confirm
 * 事前チェック
 * - 指定されたパスにファイルが存在しているかを確認します
 * - 1つでも存在しないファイルがあれば、`false` を返します
 * @param {Array} plan
 * @return {Boolean}
 */
module.exports = (plan, options) => {
  if (!checkExists(plan)) {
    return false
  }

  if (!checkFilename(plan, options.filename_max)) {
    return false
  }

  if (!checkExtensions(plan, options.exclude_extensions)) {
    return false
  }

  return true;
};
