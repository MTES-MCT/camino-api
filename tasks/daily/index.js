require('dotenv').config()
require('../../postgres/index')

const { titresGet } = require('../../postgres/queries/titres')
const {
  titresDemarchesGet
} = require('../../postgres/queries/titres-demarches')
const { titresPhasesGet } = require('../../postgres/queries/titres-phases')
const { titresEtapesGet } = require('../../postgres/queries/titres-etapes')

const titresEtapesOrdreUpdate = require('./titres-etapes-ordre-update')
const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
const titresStatutIdsUpdate = require('./titres-statut-ids-update')
const titresPhasesUpdate = require('./titres-phases-update')
const titresPropsEtapeIdUpdate = require('./titres-props-etape-id-update')

const run = async () => {
  let titresEtapes = await titresEtapesGet({})

  // détermine l'ordre des étapes
  // en fonction de leur date
  const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresEtapes)

  let titres = await titresGet({})
  let titresDemarches = await titresDemarchesGet({})

  // détermine le statut des démarches
  // en fonction de ses étapes (type, ordre, statut)
  const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(
    titresDemarches,
    titres
  )

  titresDemarches = await titresDemarchesGet({})

  // détermine l'ordre des démarche
  // en fonction de la date de leur première étape
  const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titresDemarches)

  titres = await titresGet({})

  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  const titresStatutIds = await titresStatutIdsUpdate(titres)

  titres = await titresGet({})
  titresDemarches = await titresDemarchesGet({})
  let titresPhases = await titresPhasesGet()
  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPhasesRes = await titresPhasesUpdate(
    titres,
    titresDemarches,
    titresPhases
  )

  titres = await titresGet({})

  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

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
