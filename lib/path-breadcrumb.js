'use strict';

/*
 * Path breadcrumb
 * @param {String} pathname
 * @return {Array}
 */
module.exports = pathname => {
  let res = [];
  let tmp = '';
  let dirs = pathname.split('/');

  dirs.forEach((dir, i) => {
    if (hasExtension(dir)) return;
    if (dir === '') return tmp = '/';
    tmp = tmp + dir + '/';
    return res.push(tmp.replace(/\/$/, ''));
  });
  return res;
};


/*
 * Has Extension
 * @param {String} str
 * 拡張子は以下の条件に当てはまるものとして定義
 * - 拡張子は最後のドットから始まる
 * - ドットの次の1文字はアルファベットである
 * - ドット以降は4文字以内として判断する
 */
function hasExtension(str) {
  return /\.[a-zA-Z]{1}[\w]{1,3}$/.test(str);
}
