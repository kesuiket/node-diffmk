'use strict';
/*
 * meta-counter.js
 * @author: walfo
 * @version: 0.0.3
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // commonjs
    module.exports = factory();
  } else {
    // Browser globals
    root['countup'] = factory();
  }
})(this, function () {

  return function(length) {
    var that = {};
    var whole = [];
    var completed = [];


    /*
     * Init
     * - length で与えられた数の配列を生成
     * - 生成した配列のすべての項目を `false` に設定
     */
    ;(function init() {
      for (var i = 0; i < length; i++) {
        whole[i] = false;
      }
    })();


    /*
     * api#step
     * @param {Number} index
     * @param {Function} fn
     * @return {Function} callback(closed, progress)
     */
    that.step = function(index, fn) {
      if (index > length) return ;
      whole[index] = true;
      return fn && fn(that.confirm(), that.progress());
    };


    /*
     * api#progress
     */
    that.progress = function() {
      completed = whole.filter(a => a === true);
      return (completed.length / whole.length * 100);
    }


    /*
     * api#confirm
     * @return {Boolean}
     */
    that.confirm = function() {
      return whole.every(bool => bool === true );
    };

    return that;
  };
});
