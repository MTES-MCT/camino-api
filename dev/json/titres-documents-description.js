const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

domainesIds.forEach(domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-documents.json`, '-')

  try {
    const filePath = `./sources/${fileName}`
    const documents = JSON.parse(fs.readFileSync(filePath).toString())

    documents.forEach(d => {
      d.description = d.nom
      delete d.nom
    })

    fs.writeFileSync(`${filePath}`, JSON.stringify(documents, null, 2))
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.info(e.stack)
  }
})
