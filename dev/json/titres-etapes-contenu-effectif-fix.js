const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const elementsGet = fileName => {
  fileName = decamelize(fileName, '-')
  const filePath = `./sources/${fileName}`

  return JSON.parse(fs.readFileSync(filePath).toString())
}

const elementsWrite = (fileName, elements) => {
  fileName = decamelize(fileName, '-')
  const filePath = `./sources/${fileName}`
  fs.writeFileSync(`${filePath}`, JSON.stringify(elements, null, 2))
}

let changed = 0

try {
  const activites = elementsGet('titres-activites.json')

  activites.forEach(activite => {
    if (
      activite.type_id !== 'grp' ||
      !activite.contenu ||
      !activite.contenu.renseignements ||
      !('effectifs' in activite.contenu.renseignements) ||
      activite.contenu.renseignements.effectifs === 'number'
    ) {
      return
    }

    const effectifs = activite.contenu.renseignements.effectifs
    activite.contenu.renseignements.effectifs = parseInt(effectifs)

    console.log('migration des effectifs en format nombre', activite.id)

    changed += 1
  })

  console.log()
  console.log('changement de', changed, 'activités')

  elementsWrite('titres-activites.json', activites)
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
  console.info(e.stack)
}
