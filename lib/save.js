'use strict';

const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


/*
 * Save.js
 * - 保存先フォルダの作成 > `makeRootDir()`
 *   - すでに存在する場合は、一旦削除して新規作成
 * - ファイルのコピーに必要なフォルダの作成 > `makeDirs()`
 *   - フォルダの作成に必要なパスリストを作成 > `makeDirlist()`
 * - ファイルのコピー > `makeFiles()`
 * @param {Array} list
 * @param {String} dest
 * @param {String} cwd
 */
module.exports = (list, dest, cwd, callback) => {
  // 保存先フォルダの作成
  return makeRootDir(path.join(cwd, dest), (root) => {
    // ファイルのコピーに必要なフォルダの作成
    return makeDirs(list, dest, () => {
      // ファイルのコピー
      return makeFiles(list, dest, callback);
    });
  });
};


/*
 * Make Root Dir
 * @param {String} root
 * @param {Function} callback
 */
function makeRootDir(root, callback) {
  // 保存先フォルダがすでにある場合は一旦削除する
  let rm = 'if [ -e '+ root +' ]; then rm -rf ' + root + '; fi';
  let removed = exec(rm, (error, stdout, stderr) => {
    if (error !== null) throw ('Error: makeRootDir: ' + error);
  }).on('close', () => {
    // 削除後、保存先フォルダを作成
    let maked = exec('mkdir ' + root).on('close', () => {
      return callback && callback(root);
    });
  });
}


/*
 * Make Dirs
 * 必要なフォルダのリストを作成
 * @param {Array} list
 * @param {String} dest
 * @param {Function} callback
 */
function makeDirs(list, dest, callback) {

  // フォルダパスのリストを作成
  let all = list.map((file) => {
    let source = file;
    let target = path.join(dest, file);
    let steps = makeDirlist(target.split('/'));
    return steps;
  });

  // 配列をフラットにして重複分を排除
  let uniq = _.uniq(_.flatten(all));

  // フォルダを作成
  let shell = path.join(__dirname, '../sh/makedirs.sh');
  return exec('chmod +x ' + shell, (error, stdout, stderr) => {
    return execFile(shell, uniq, (error, stdout, stderr) => {
      if (error !== null) throw ('Error: makeDirs makedis.sh: ' + error);
    }).on('close', callback);
  });
}


/*
 * Make Dir List
 * - パスから段階的なフォルダリストを生成
 * < aaa/bbb/ccc
 * > [aaa, aaa/bbb, aaa/bbb/ccc]
 * @param {Array} dirs
 * @return {Array}
 */
function makeDirlist(dirs) {
  let tmp = '';

  // ファイルを除外
  let res = dirs.map((dir, index) => {
    if (dir.match(/\.[\w]+$/)) return '';
    tmp = path.join(tmp, dir);
    return tmp;
  });

  // 配列から空白を除外
  res = res.filter((a) => {
    return a !== '';
  });

  return res;
}


/*
 * Make Files
 * @param {Array} list
 * @param {String} dest
 * @param {Function} callback
 */
function makeFiles(list, dest, callback) {
  let shell = path.join(__dirname, '../sh/copy.sh');

  return exec('chmod +x ' + shell, (err) => {
    if (err !== null) throw ('Error: makeFiles: chmod: ' + err);
    let finaly = []; // 全てのファイルコピー終了を確認するためのフラグ配列
    let tmp = []; // 保存先のパスを格納する配列
    finaly.length = list.length;

    list.map((file, index) => {
      let source = file; // コピー元
      let target = path.join(dest, file); // 保存先
      finaly[index] = false;
      tmp[index] = target;

      // ファイルをコピーする
      let copied = execFile(shell, [source, target, index], (error, stdout) => {
        if (error !== null) throw ('Error: makeFiles: copy.sh: ' + error);
        finaly[+stdout] = true;
      }).on('close', (data) => {
        // 各ファイルコピー終了後に全てのコピーが終了したかを確認する
        let res = finaly.every(a => a === true);
        // 全てのファイルのコピー後
        return (res && callback) && callback(tmp, dest);
      });
    });
  });
}
