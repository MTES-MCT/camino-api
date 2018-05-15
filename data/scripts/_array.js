require('../../mongoose/index')
const chalk = require('chalk')

module.exports = name => {
  const Model = require(`../../mongoose/models/${name}`)
  const elements = require(`../sources/${name}.json`)
  const log = (current, total, e, color) => {
    console.log(
      chalk.bold[color](current) + ' / ' + total + `. import ${e} in ${name}.`
    )
    if (current === total) {
      console.log(chalk.bold.green(`Processed ${total} elements.`))
    }
  }

  let n = 0

  elements.forEach(element => {
    const document = new Model(element)

    document.save().then(
      el => {
        n++
        log(n, elements.length, el, 'green')
      },
      err => {
        n++
        log(n, elements.length, err, 'red')
      }
    )
  })
}
