'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const ext = '.txt';
const prefix = 'diff@';
const pwd = process.cwd();

module.exports = (f /*, opt */) => {
  //let timestamp = +(new Date()); // タイムスタンプを保存
  let txt = checkExt(f); // 拡張子付きのファイル名 (*.txt)
  let name = txt.replace(/(^[\w\d_-]+)\.(?:[\w]+)$/, '$1'); // 拡張子なしのファイル名
  let dest = path.join(pwd, ([prefix, name].join(''))); // 保存先フォルダ名を作成
  let list = makeFileList(loadFile(txt)); // ファイルリストの配列を生成
  let done = clearner(txt, dest);

  return check(list) && exec(list, dest) && done();
};


/*
 * Make File List
 * テキスト
 * @param {String} txt
 * @return {Array}
 */
function makeFileList(txt) {
  let list = txt.split(/\r\n|\n|\r/);
  return list.filter(a => a !== '');
}


/*
 * Exec
 * @param {Array} list
 * @param {String} dest
 */
function exec(list, dest) {

  // 保存先ディレクトリーの作成
  fs.mkdir(dest, (err) => {
    if (err && err.code === 'EEXIST') {
      // すでにディレクトリーがある場合は一旦削除
      del.sync(dest + '/**');
    }
    return makeFiles(list, dest);
  });

  return true;
}


/*
 * Check
 * Exec 前の事前チェック
 * @param {Array}  list
 */
function check(list) {
  return checkExsitsFiles(list);
}


/*
 * Check Exists files
 * ファイルリストで指定されたパスにファイルが存在しているかを確認します
 * 1つでも存在しないファイルがあれば、`false` を返します
 * @param {Array} list
 * @return {Boolean}
 */
function checkExsitsFiles(list) {
  let tmp = [];
  let errors = false;

  list.map(a => {
    try {
      fs.openSync(a, 'r');
    } catch (e) {
      errors = true;
      tmp.push(a);
    }
  });

  if (errors) {
    console.error('存在しないファイルが指定されています');
    console.error(tmp.join('\n'));
  }

  return !errors;
}


/*
 * Make files
 * @param {Array} files
 */
function makeFiles(files, base) {
  files.map(src => {
    if (src == '' || src.length < 1) return;
    let dest = path.join(base, src);
    let dir = path.relative(pwd, dest);

    makeDirs(dir); // ディレクトリーを用意
    makeFile(src, dest); // ファイルをコピー
    return ;
  });

  return true;
}


/*
 * Make File
 * ファイルのコピーを配置
 * - 相対パスを受け取る
 * @param {String} src
 * @param {String} dest
 * @return
 */
function makeFile(src, dest) {
  src = path.relative(pwd, src);
  dest = path.relative(pwd, dest);

  let read = fs.createReadStream(src);
  let write = fs.createWriteStream(dest);

  read.on('data', (data) => {
    if (write.write(data)) {
      read.pause();
    }
  });

  write.on('drain', () => {
    read.resume();
  });

  read.on('close', () => {
    read.pipe(write);
  });

  read.on('error', (e) => {
    //console.log('[read error]', e);
  });

  write.on('error', (e) => {
    //console.log('[write error]', e);
  });
}


/*
 * Make dirs
 * 必要となるディレクトリーを作成する
 * 相対パスを受け取る
 * @param {String} relpath
 */
function makeDirs(relpath) {
  let dirs = relpath.split('/');
  let steps = makeDirList(dirs);
  return steps.map(dir => makeDir(dir));
}


/*
 * Make Dir
 * ディレクトリーの作成
 * 相対パスを受け取る
 * @param {String} relpath
 * @return {Boolean}
 */
function makeDir(relpath) {
  try {
    fs.mkdirSync(relpath);
  } catch (err) {
    //console.log('[makeDir:error] ', err);
    return true;
  }
  return false;
}


/*
 * Make Dir List
 * パスから段階的なディレクトリーリストを生成
 * < aaa/bbb/ccc
 * > [aaa, aaa/bbb, aaa/bbb/ccc]
 * @param {Array} dirs
 * @return {Array}
 */
function makeDirList(dirs) {
  let steps = [];
  let tmp = '';
  dirs.map((dir, index) => {
    if (dir.match(/\.[\w]+$/)) return;
    tmp = path.join(tmp, dir);
    return steps.push(tmp);
  });
  return steps;
}


/*
 * Load File
 * ファイルを読み込む
 * 相愛パスを受け取る
 * @param {String} relfile (*|*.txt)
 */
function loadFile(relfile) {
  try {
    return fs.readFileSync(relfile, 'utf8');
  } catch (err) {
    throw ('ファイルが正しくありません', err);
  }
  return false;
}


/*
 * Done
 * @param {String} log
 * @param {String} dest
 * @return {Object} console.log
 */
function clearner(log, dest) {
  return function() {
    // ファイルリストを README として保存先ディレクトリに出力
    makeFile(log, path.join(dest, 'README' + ext));
    return console.log('[ Completed! ]');
  };
}


/*
 * Check Ext
 * 引数に指定された文字列に拡張子の有無を確認
 * @param {String} str
 * @return {String} *.txt
 */
function checkExt(str) {
  if (!str) throw ('ファイルが指定されていません');
  if (str.match(/\.[\w]+$/)) {
    return str;
  } else {
    return str + ext;
  }
}
