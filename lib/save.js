'use strict';

const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


/*
 * Save
 * - 保存先のルートフォルダを生成し、ファイル生成の指示を出す
 * @param {Array} list
 * @param {String} dest
 * @param {String} cwd
 */
module.exports = (list, dest, cwd, callback) => {
  let root = path.join(cwd, dest);
  // 保存先フォルダがすでにある場合は一旦削除する
  let rm = 'if [ -e '+ root +' ]; then rm -rf ' + root + '; fi';
  let removed = exec(rm, (error, stdout, stderr) => {
    if (error !== null) return;
  });

  return removed.on('close', () => {
    // 削除後、保存先フォルダを作成
    let maked = exec('mkdir ' + root);
    maked.on('close', () => {
      // コピーに必要なフォルダを作成
      makeDirs(list, dest, () => {
        // ファイルを作成
        return makeFiles(list, dest, callback);
      });
    });
  });
};


/*
 * Make Files
 * @param {Array} list
 * @param {String} dest
 * @param {Function} callback
 */
function makeFiles(list, dest, callback) {
  let shell = path.join(__dirname, '../sh/copy.sh');

  return exec('chmod +x ' + shell, (err) => {
    if (err) return;
    let finaly = [], tmp = [];
    finaly.length = list.length;

    list.map((file, index) => {
      let source = file;
      let target = path.join(dest, file);
      tmp.push(target);
      finaly[index] = false;

      // ファイルをコピーする
      let copied = execFile(shell, [source, target, index], (error, stdout) => {
        finaly[+stdout] = true;
      });

      // 全てのファイルのコピー後
      copied.on('close', (data) => {
        //console.log('[copied]', target);
        let res = finaly.every(a => a === true);
        return (res && callback) && callback(tmp, dest);
      });
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
  let all = [];
  let uniq = [];

  // フォルダパスのリストを作成
  list.map((file) => {
    let source = file;
    let target = path.join(dest, file);
    let steps = makeDirlist(target.split('/'));
    all.push(steps);
  });

  // フォルダパスのリストの重複分を削除
  uniq = _.uniq(_.flatten(all));

  // フォルダを作成
  let shell = path.join(__dirname, '../sh/makedirs.sh');
  return exec('chmod +x ' + shell, (error, stdout, stderr) => {
    if (error !== null) console.error('Error: makeDirs chmod');
    let maked = execFile(shell, uniq, (error, stdout, stderr) => {
      if (error !== null) console.error('Error: makeDirs makedis.sh', error);
    });
    maked.on('close', callback);
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
  let steps = [];
  let tmp = '';
  dirs.map((dir, index) => {
    if (dir.match(/\.[\w]+$/)) return;
    tmp = path.join(tmp, dir);
    return steps.push(tmp);
  });
  return steps;
}
