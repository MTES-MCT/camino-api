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
  const etapes = elementsGet('titres-m-titres-etapes.json')

  etapes.forEach(etape => {
    if (etape.type_id !== 'meo' || !etape.contenu || !etape.contenu.onf) {
      return
    }

    // On supprime toute la section ONF de MEO, car elle contient que les forêts
    delete etape.contenu.onf

    console.info('suppression de la section ONF de l’étape : ', etape.id)

    changed += 1
  })

  console.info()
  console.info('changement de', changed, 'étapes')

  elementsWrite('titres-m-titres-etapes.json', etapes)
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
  console.info(e.stack)
}
