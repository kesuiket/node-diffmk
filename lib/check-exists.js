const fs = require('fs')
const chalk = require('chalk')

module.exports = (files) => {
  const errors = []

  files.forEach(file => {
    try {
      fs.openSync(file, 'r')
    } catch (e) {
      errors.push('- ' + file)
    }
  });

  if (errors.length > 0) {
    console.error(`${chalk.red('× Program aborted.....')}`)
    console.error(`> It contains non-existent files.`)
    console.error(`${chalk.gray(errors.join('\n'))}`)
    console.log('');
  }

  return errors.length === 0
}