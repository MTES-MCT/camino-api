const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const domaineIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

domaineIds.forEach(domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres.json`, '-')

  try {
    const filePath = `./sources/${fileName}`
    const titres = JSON.parse(fs.readFileSync(filePath).toString())

    titres.forEach(t => {
      t.type_id = t.type_id.replace(/x$/, t.domaine_id)
      if (t.type_id === 'pxc') {
        t.type_id = 'pcc'
      }
    })

    fs.writeFileSync(`${filePath}`, JSON.stringify(titres, null, 2))
  } catch (e) {
    console.log(chalk.red(e.message.split('\n')[0]))
  }
})
