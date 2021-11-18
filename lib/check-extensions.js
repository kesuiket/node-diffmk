const path = require('path')
const chalk = require('chalk')

module.exports = (files, exclude) => {
  let errors = []

  files.forEach(file => {
    const basename = path.basename(file)
    const ext = path.extname(file)

    if (exclude.indexOf(ext) > -1) {
      errors.push(`- ${basename}`)
    }
  })

  if (errors.length > 0) {
    console.error(`${chalk.red('× Program aborted.....')}`)
    console.error(`> These file extensions are not allowed. [${exclude.join(', ')}]`)
    console.error(`${chalk.gray(errors.join('\n'))}`)
    console.log('');
  }

  return errors.length === 0
}