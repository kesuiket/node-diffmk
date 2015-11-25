'use strict';

module.exports = (file, dest, cwd) => {
  return (make, confirm, save, done) => {
    make(file, cwd, (list) => {
      if (confirm(list)) {
        return save(list, dest, cwd, done);
      }
    });
  };
};
