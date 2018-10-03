require('dotenv').config()
require('../postgres/index')

const titresEtapesOrdreUpdate = require('./titres-etapes-ordre-update')
const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
const titresStatutIdsUpdate = require('./titres-statut-ids-update')
const titresPhasesUpdate = require('./titres-phases-update')
const titresPropsEtapeIdUpdate = require('./titres-props-etape-id-update')

const run = async () => {
  // détermine l'ordre des étapes
  // en fonction de leur date
  const titresEtapesOrdre = await titresEtapesOrdreUpdate()

  // détermine le statut des démarches
  // en fonction de ses étapes (type, ordre, statut)
  const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate()

  // détermine l'ordre des démarche
  // en fonction de la date de leur première étape
  const titresDemarchesOrdre = await titresDemarchesOrdreUpdate()

  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  const titresStatutIds = await titresStatutIdsUpdate()

  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPhases = await titresPhasesUpdate()

  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate()

  console.log(titresEtapesOrdre)
  console.log(titresDemarchesStatutId)
  console.log(titresDemarchesOrdre)
  console.log(titresStatutIds)
  console.log(titresPhases)
  console.log(titresPropsEtapeId)

  console.log('Tâches quotidiennes executées')
  process.exit()
}

run()
