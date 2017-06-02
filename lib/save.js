'use strict';

const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const countup = require('meta-countup');
const pathcrumb = require('path-breadcrumb');


/*
 * Save.js
 * - 保存先フォルダの作成 > `makeRootDir()`
 *   - すでに存在する場合は、一旦削除して新規作成
 * - ファイルのコピーに必要なフォルダの作成 > `makeDirs()`
 *   - フォルダの作成に必要なパスリストを作成 > `makeDirlist()`
 * - ファイルのコピー > `makeFiles()`
 * @param {Array} plan
 * @param {String} dest
 * @param {String} cwd
 * @param {String|null} savedir
 */
module.exports = (plan, dest, cwd, savedir, callback) => {
  // 保存先フォルダの作成
  return makeRootDir(dest, cwd, savedir, (root) => {
    // ファイルのコピーに必要なフォルダの作成
    return makeDirs(plan, dest, savedir, () => {
      // ファイルのコピー
      return makeFiles(plan, dest, savedir, callback);
    });
  });
};


/*
 * Make Root Dir
 * @param {String} root
 * @param {Function} callback
 */
function makeRootDir(dest, cwd, savedir, callback) {
  let root = path.join(cwd, (savedir || ''), dest.split('/')[0]);
  console.log('delete: ', root)
  // 保存先フォルダがすでにある場合は一旦削除する
  let rm = 'if [ -e '+ root +' ]; then rm -rf ' + root + '; fi';
  let removed = exec(rm, (error, stdout, stderr) => {
    if (error !== null) throw ('[Error: makeRootDir:] ' + error);
  }).on('close', () => {
    // 削除後、保存先フォルダを作成
    let maked = exec('mkdir ' + root).on('close', () => {
      return callback && callback();
    });
  });
}


/*
 * Make Dirs
 * 必要なフォルダのリストを作成
 * @param {Array} plan
 * @param {String} dest
 * @param {String} savedir
 * @param {Function} callback
 */
function makeDirs(plan, dest, savedir, callback) {

  // フォルダパスのリストを作成
  let all = plan.map(file => {
    let dirname = path.dirname(path.join(savedir, dest, file)); //ファイル名を除外
    return pathcrumb(dirname);
  });

  // 配列をフラットにして重複分を排除
  let uniq = _.uniq(_.flatten(all));

  // フォルダを作成
  let shell = path.join(__dirname, '../sh/makedirs.sh');
  return exec('chmod +x ' + shell, (error, stdout, stderr) => {
    return execFile(shell, uniq, (error, stdout, stderr) => {
      if (error !== null) throw ('[Error: makeDirs makedis.sh:] ' + error);
    }).on('close', callback);
  });
}


/*
 * Make Files
 * @param {Array} list
 * @param {String} dest
 * @param {String} savedir
 * @param {Function} callback
 */
function makeFiles(list, dest, savedir, callback) {
  let shell = path.join(__dirname, '../sh/copy.sh');

  return exec('chmod +x ' + shell, (err) => {
    if (err !== null) throw ('[Error: makeFiles: chmod:] ' + err);
    let tmp = []; // 保存先のパスを格納する配列
    let fin = countup(list.length);

    list.forEach((file, index) => {
      let source = file; // コピー元
      let target = path.join(savedir, dest, file); // 保存先
      tmp[index] = target;

      // ファイルをコピーする
      let copied = execFile(shell, [source, target, index], (error, stdout, stderr) => {
        if (error !== null) throw ('[Error: makeFiles: copy.sh:] ' + error);
        fin.step(+stdout, (closed, progress) => {
          return (closed && callback) && callback(tmp, path.join(savedir, dest));
        });
      });
    });
  });
}
