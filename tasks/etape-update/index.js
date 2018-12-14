require('dotenv').config()
require('../../database/index')
const { titreGet } = require('../../database/queries/titres')
const { titreDemarcheGet } = require('../../database/queries/titres-demarches')
const { titreEtapeGet } = require('../../database/queries/titres-etapes')

const titreEtapesOrdreUpdate = require('./titre-etapes-ordre-update')
const titreDemarcheStatutIdUpdate = require('./titre-demarche-statut-id-update')
const titreDemarchesOrdreUpdate = require('./titre-demarches-ordre-update')
const titreStatutIdsUpdate = require('./titre-statut-id-update')
const titrePhasesUpdate = require('./titre-phases-update')
const titrePropsEtapeIdUpdate = require('./titre-props-etape-id-update')

const run = async titreEtape => {
  // détermine l'ordre des étapes
  // en fonction de leur date

  const titreEtapeOld = await titreEtapeGet(titreEtape.id)
  const titreDemarcheId = titreEtapeOld.titreDemarcheId
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreId = titreDemarche.titreId
  const titreEtapesOrdre = await titreEtapesOrdreUpdate(titreDemarche)

  // détermine le statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)

  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  let titre = await titreGet(titreId)
  const titreTypeId = titre.typeId
  const titreDemarcheStatutId = await titreDemarcheStatutIdUpdate(
    titreDemarche,
    titreTypeId
  )

  // détermine l'ordre des démarches
  // en fonction de la date de leur première étape
  titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titreDemarchesOrdreUpdate(titre.demarches)

  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titreStatutIdsUpdate(titre)

  // détermine les phases
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titrePhasesUpdate(titre)

  // détermine les phases
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titrePropsEtapeIdUpdate(titre)

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreStatutIds)
  console.log(titresPhases)
  console.log(titresPropsEtapeId)

  console.log('Étape mise à jour')
}

module.exports = run
