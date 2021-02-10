'use strict';

const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const path = require('path');
const chalk = require('chalk');
const format = require('date-fns').format

/*
 * Done
 * 後処理
 */
module.exports = label => {

  return (list, dest) => {
    let shell = path.join(__dirname, '../sh/done.sh');
    let ts = format(new Date(), 'yyyy-MM-dd HH.mm.ss'); //スクリーンショット 2021-02-10 15.08.01
    let readme = path.join(dest, `README ${ts}`);
    console.log(readme)

    exec('chmod +x ' + shell, () => {
      let sizes = [];
      let listed = execFile(shell, list, (error, stdout) => {
        sizes = stdout.replace(/\n/g,'').split(',').filter((a) => {
          return a !== '';
        });
      });

      listed.on('close', () => {
        let dubious = [];
        let note = sizes.map((a) => {
          let res = a.split('=');
          let name = res[0].replace(dest + '/', '');
          let kb = res[1] / 1000;
          let size = '(' + kb.toFixed(2) + 'kb)';
          let msg = name + ' ' + size;
          if (kb < 1) dubious.push('- ' + msg); // get file of less then 10kb
          return msg;
        });

        exec('echo "'+ note.join('\n') +'" > "' + readme + '"', () => {
          console.log(`${chalk.green('✓ All files copied.')} (${label})`);

          if (dubious.length > 0) {
            console.log(`> There are files of less than 1kb. all right?`)
            console.log(`${chalk.magenta(dubious.join('\n'))}`);
            console.log('');
          }
        });
      });
    });
  };
};
