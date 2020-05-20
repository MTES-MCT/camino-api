const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

domainesIds.forEach(domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-etapes.json`, '-')

  try {
    const filePath = `./sources/${fileName}`
    const etapes = JSON.parse(fs.readFileSync(filePath).toString())

    etapes.forEach(t => {
      if (!t.contenu) return

      Object.keys(t.contenu).forEach(section =>
        Object.keys(t.contenu[section]).forEach(elementId => {
          if (!['volume', 'engagement'].includes(elementId)) return

          if (typeof t.contenu[section][elementId] !== 'string') return

          console.info('modification de', elementId, t.id)

          t.contenu[section][elementId] = Number(t.contenu[section][elementId])
        })
      )
    })

    fs.writeFileSync(`${filePath}`, JSON.stringify(etapes, null, 2))
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.info(e.stack)
  }
})
