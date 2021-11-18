const path = require('path')
const chalk = require('chalk')

module.exports = (files, max = 30) => {
  let errors = []

  files.forEach(file => {
    const basename = path.basename(file)
    const length = basename.length

    if (length > max) {
      errors.push(`- ${basename} (${length})`)
    }
  })

  if (errors.length > 0) {
    console.error(`${chalk.red('× Program aborted.....')}`)
    console.error(`> These filenames is longer. Max is ${max}.`)
    console.error(`${chalk.gray(errors.join('\n'))}`)
    console.log('');
  }

  return errors.length < 1
}