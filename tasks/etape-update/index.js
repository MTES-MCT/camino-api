require('dotenv').config()
require('../../postgres/index')

const titreEtapesOrdreUpdate = require('./titre-etapes-ordre-update')
const titreDemarcheStatutIdUpdate = require('./titre-demarche-statut-id-update')
const titreDemarchesOrdreUpdate = require('./titre-demarches-ordre-update')
const titreStatutIdsUpdate = require('./titre-statut-id-update')
const titrePhasesUpdate = require('./titre-phases-update')
const titrePropsEtapeIdUpdate = require('./titre-props-etape-id-update')

const run = async titreEtape => {
  // détermine l'ordre des étapes
  // en fonction de leur date
  const titreEtapesOrdre = await titreEtapesOrdreUpdate(
    titreEtape.titreDemarcheId
  )

  // détermine le statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)
  const titreDemarcheStatutId = await titreDemarcheStatutIdUpdate(
    titreEtape.titreDemarcheId
  )

  // détermine l'ordre des démarches
  // en fonction de la date de leur première étape
  const titreDemarchesOrdre = await titreDemarchesOrdreUpdate(
    titreEtape.titreDemarcheId
  )

  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  const titreStatutIds = await titreStatutIdsUpdate(titreEtape.titreDemarcheId)

  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPhases = await titrePhasesUpdate(titreEtape.titreDemarcheId)

  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPropsEtapeId = await titrePropsEtapeIdUpdate(
    titreEtape.titreDemarcheId
  )

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreStatutIds)
  console.log(titresPhases)
  console.log(titresPropsEtapeId)

  console.log('Étape mise à jour')
}

module.exports = run
