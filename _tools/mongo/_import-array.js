require('dotenv').config()
require('../../mongo')
const chalk = require('chalk')

module.exports = (source, model) => {
  const Model = require(`../../mongo/models/${model}`)
  const elements = require(`../sources/${source}.json`)
  const log = (current, total, e, color) => {
    console.log(' ')
    console.log(' ')
    console.log(chalk.bold[color](current) + ' / ' + total)
    console.log(' ')
    console.log(e)
    if (current === total) {
      console.log(' ')
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
