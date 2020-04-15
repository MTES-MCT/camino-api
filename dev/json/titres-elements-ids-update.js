const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const titresElementsFiles = [
  'titresReferences',
  'titresDemarches',
  'titresDemarchesLiens',
  'titresPhases',
  'titresEtapes',
  'titresPoints',
  'titresPointsReferences',
  'titresDocuments',
  'titresSubstances',
  'titresTitulaires',
  'titresAmodiataires',
  'titresCommunes',
  'titresAdministrationsGestionnaires',
  'titresAdministrationsLocales',
  'titresIncertitudes'
]

let changedTotal = 0

const idsChanges = {}

domainesIds.forEach(domaineId =>
  titresElementsFiles.forEach(element => {
    const fileName = decamelize(`titres-${domaineId}-${element}.json`, '-')

    try {
      const filePath = `./sources/${fileName}`
      const elements = JSON.parse(fs.readFileSync(filePath).toString())

      let changed = 0

      elements.forEach(t => {
        // l'élément possède un id propre
        if (t.id) {
          Object.keys(t).forEach(k => {
            let change = false

            // si la clé de l'objet finit par `_id`
            // et qu'elle n'est pas du genre `type_id`, `statut_id` ou `annulation_demarche_id`
            // alors on l'utilise pour changer l'id de l'élément
            // (ex : `titre_id` pour une démarche ou `titre_point_id` pour une référence de point)
            if (k.match('_id') && !k.match(/(type|statut|annulation)_/)) {
              // si l'id parent a changé
              // alors on le met aussi à jour dans l'élément enfant
              if (idsChanges[t[k]]) {
                t[k] = idsChanges[t[k]]

                change = true
              }

              if (!t.id.includes(t[k])) {
                const parentParts = t[k].split('-')
                const elementParts = t.id.split('-')

                const lastParts = elementParts
                  .slice(parentParts.length - elementParts.length)
                  .join('-')

                const idNew = `${t[k]}-${lastParts}`

                // permet de pouvoir mettre à jour les éléments enfants si besoin
                idsChanges[t.id] = idNew

                t.id = idNew

                change = true
              }
            }

            if (change) {
              changed += 1
            }
          })
        }
      })

      if (changed) {
        console.info(
          filePath,
          "changements d'ids:",
          changed,
          '/ total elements:',
          elements.length
        )

        changedTotal += changed
      }

      fs.writeFileSync(filePath, JSON.stringify(elements, null, 2))
    } catch (e) {
      console.info(chalk.red(e.message.split('\n')[0]))
    }
  })
)

if (!changedTotal) {
  console.info("aucun changement d'id")
}
