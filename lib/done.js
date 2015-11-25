'use strict';

const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const path = require('path');

/*
 * Done
 * 後処理
 */
module.exports = (list, dest) => {
  let shell = path.join(__dirname, '../sh/done.sh');
  let readme = path.join(dest, 'README');
  exec('chmod +x ' + shell, () => {
    let sizes = [];
    let listed = execFile(shell, list, (error, stdout) => {
      sizes = stdout.replace(/\n/g,'').split(',').filter((a) => {
        return a !== '';
      });
    });

    listed.on('close', () => {
      let note = sizes.map((a) => {
        let res = a.split('=');
        let name = res[0].replace(dest + '/', '');
        let size = '(' + (res[1] / 1000).toFixed(2) + 'kb)';
        return name + ' ' + size;
      });

      exec('echo "'+ note.join('\n') +'" > ' + readme, () => {
        console.log('[Completed]');
      });
    });
  });
};
