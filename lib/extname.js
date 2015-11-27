'use strict';

const path = require('path');

module.exports = file => {
  let ext = path.extname(file);

  return {
    rm: () => {
      return file.replace(ext, '');
    },
    is: (ext) => {
      return !(ext === '');
    },
    add: (ext) => {
      return file + '.' + ext;
    }
  };
};
