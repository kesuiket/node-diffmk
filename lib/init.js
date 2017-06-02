'use strict';

/*
 * 全体の流れ
 */
module.exports = (blueprint, destination, cwd, savedir = null) => {
  return (makeplan, confirm, save, done) => {
    makeplan(blueprint, cwd, (plan) => {
      if (confirm(plan)) {
        return save(plan, destination, cwd, savedir, done);
      }
    });
  };
};
