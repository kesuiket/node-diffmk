'use strict';

/*
 * 全体の流れ
 */
module.exports = (listFile, dest, cwd, savedir = null, options) => {
  return (makeplan, confirm, save, done) => {
    makeplan(listFile, cwd, (plan) => {
      if (confirm(plan, options)) {
        return save(plan, dest, cwd, savedir, done);
      }
    });
  };
};
