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
  const titres = elementsGet('titres-m-titres.json')
  const etapes = elementsGet('titres-m-titres-etapes.json')

  etapes.forEach(etape => {
    if (
      etape.type_id !== 'rde' ||
      !etape.contenu ||
      !etape.contenu.deal ||
      !('franchissements' in etape.contenu.deal)
    ) {
      return
    }

    const franchissements = etape.contenu.deal.franchissements

    //On bouge les franchissements de section
    delete etape.contenu.deal.franchissements
    if (!etape.contenu.arm) {
      etape.contenu.arm = {}
    }
    etape.contenu.arm.franchissements = franchissements

    //On met aussi les franchissements dans la MFR
    const etapeMfr = etapes.find(
      e =>
        e.titre_demarche_id === etape.titre_demarche_id && e.type_id === 'mfr'
    )

    if (!etapeMfr.contenu) {
      etapeMfr.contenu = {}
    }
    if (!etapeMfr.contenu.arm) {
      etapeMfr.contenu.arm = {}
    }
    etapeMfr.contenu.arm.franchissements = franchissements

    const titre = titres.find(t => t.id === etape.id.slice(0, -12))

    if (!titre.props_titre_etapes_ids) {
      titre.props_titre_etapes_ids = {}
    }
    if (!titre.props_titre_etapes_ids.arm) {
      titre.props_titre_etapes_ids.arm = {}
    }
    titre.props_titre_etapes_ids.arm.franchissements = etapeMfr.id

    console.log(
      'migration des franchissements depuis',
      etape.id,
      'vers etape mfr:',
      etapeMfr.id,
      'valeur:',
      franchissements
    )

    changed += 1
  })

  console.log()
  console.log('changement de', changed, 'étapes')

  elementsWrite('titres-m-titres.json', titres)
  elementsWrite('titres-m-titres-etapes.json', etapes)
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
  console.info(e.stack)
}
