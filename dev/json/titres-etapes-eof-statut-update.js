const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const elementsGet = fileName => {
  fileName = decamelize(fileName, { separator: '-' })
  const filePath = `./sources/${fileName}`

  return JSON.parse(fs.readFileSync(filePath).toString())
}

const elementsWrite = (fileName, elements) => {
  fileName = decamelize(fileName, { separator: '-' })
  const filePath = `./sources/${fileName}`
  fs.writeFileSync(`${filePath}`, JSON.stringify(elements, null, 2))
}

let changed = 0

try {
  const etapes = elementsGet('titres-m-titres-etapes.json')

  etapes.forEach(etape => {
    if (etape.type_id !== 'eof' || etape.statut_id === 'fai') {
      return
    }

    const statutIdOld = etape.statut_id

    if (!etape.contenu) {
      etape.contenu = {}
    }

    if (!etape.contenu.onf) {
      etape.contenu.onf = {}
    }

    if (!etape.contenu.onf.motifs) {
      etape.contenu.onf.motifs = ''
    } else {
      etape.contenu.onf.motifs += '\n'
    }

    etape.contenu.onf.motifs +=
      etape.statut_id === 'fav'
        ? 'expertise favorable'
        : 'expertise défavorable'

    etape.statut_id = 'fai'

    console.info(
      etape.id,
      'migration du statut depuis',
      statutIdOld,
      'vers fai'
    )

    changed += 1
  })

  console.info()
  console.info('changement de', changed, 'étapes')

  elementsWrite('titres-m-titres-etapes.json', etapes)
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
  console.info(e.stack)
}
