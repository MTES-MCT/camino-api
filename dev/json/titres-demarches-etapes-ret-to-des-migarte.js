const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const modify = (domaineId, type, field) => {
  const fileName = decamelize(`titres-${domaineId}-titres-${type}s.json`, '-')

  let changed = 0

  try {
    const filePath = `./sources/${fileName}`

    const elements = JSON.parse(fs.readFileSync(filePath).toString())

    elements.forEach(e => {
      if (e[field] === 'ret') {
        e[field] = 'des'

        changed += 1
      }
    })

    fs.writeFileSync(`${filePath}`, JSON.stringify(elements, null, 2))

    if (changed) {
      console.info(`[${domaineId}] ${type}(s) modifié(e)(s) : ${changed}`)
    } else {
      console.info(`[${domaineId}] aucun(e) ${type} modifié(e)`)
    }
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
  }
}

domainesIds.forEach(domaineId => {
  modify(domaineId, 'etape', 'type_id')

  modify(domaineId, 'demarche', 'statut_id')

  console.log('')
})
