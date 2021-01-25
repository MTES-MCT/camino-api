const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

let changed = 0

const fileName = decamelize('titres-activites.json', { separator: '-' })

try {
  const filePath = `./sources/${fileName}`
  const activites = JSON.parse(fs.readFileSync(filePath).toString())

  activites.forEach(a => {
    if (['gra', 'grp'].includes(a.type_id) && a.statut_id === 'fer') {
      a.statut_id = 'abs'

      changed += 1
    }
  })

  fs.writeFileSync(`${filePath}`, JSON.stringify(activites, null, 2))
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
}

if (changed) {
  console.info('titres-activites modifees :', changed)
} else {
  console.info('aucune activite modifiee')
}
