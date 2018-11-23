require('dotenv').config()
require('../../database/index')

const { titresGet } = require('../../database/queries/titres')
const {
  titresDemarchesGet
} = require('../../database/queries/titres-demarches')
const { titresPhasesGet } = require('../../database/queries/titres-phases')
const { titresEtapesGet } = require('../../database/queries/titres-etapes')

const titresEtapesOrdreUpdate = require('./titres-etapes-ordre-update')
const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
const titresStatutIdsUpdate = require('./titres-statut-ids-update')
const titresPhasesUpdate = require('./titres-phases-update')
const titresPropsEtapeIdUpdate = require('./titres-props-etape-id-update')

const run = async () => {
  // 1.
  // détermine l'ordre des étapes
  // en fonction de leur date
  let titresEtapes = await titresEtapesGet({})
  const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresEtapes)

  // 2.
  // détermine le statut des démarches
  // en fonction de ses étapes (type, ordre, statut)
  let titres = await titresGet({})
  let titresDemarches = await titresDemarchesGet({})
  const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(
    titresDemarches,
    titres
  )

  // 3.
  // détermine l'ordre des démarche
  // en fonction de la date de leur première étape
  titresDemarches = await titresDemarchesGet({})
  const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titresDemarches)

  // 4.
  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  titres = await titresGet({})
  const titresStatutIds = await titresStatutIdsUpdate(titres)

  // 5.
  // détermine les phases
  // en fonction des démarches et de la date du jour
  titres = await titresGet({})
  titresDemarches = await titresDemarchesGet({})
  let titresPhases = await titresPhasesGet()
  const titresPhasesRes = await titresPhasesUpdate(
    titres,
    titresDemarches,
    titresPhases
  )

  // 6.
  // détermine les phases
  // en fonction des démarches et de la date du jour
  titres = await titresGet({})
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

  // logs
  console.log(titresEtapesOrdre)
  console.log(titresDemarchesStatutId)
  console.log(titresDemarchesOrdre)
  console.log(titresStatutIds)
  console.log(titresPhasesRes)
  console.log(titresPropsEtapeId)

  console.log('Tâches quotidiennes executées')
  process.exit()
}

run()
