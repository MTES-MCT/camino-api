require('dotenv').config()
require('../../postgres/index')
const { titreGet } = require('../../postgres/queries/titres')
const { titreDemarcheGet } = require('../../postgres/queries/titres-demarches')
const { titreEtapeGet } = require('../../postgres/queries/titres-etapes')

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
  const titreDemarche = await titreDemarcheGet(titreEtapeOld.titreDemarcheId)
  const titre = await titreGet(titreDemarche.titreId)
  const titreIsAxm = titre.typeId === 'axm'

  const titreEtapesOrdre = await titreEtapesOrdreUpdate(titreDemarche)

  // détermine le statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)
  const titreDemarcheStatutId = await titreDemarcheStatutIdUpdate(
    titreDemarche,
    titreIsAxm
  )

  // détermine l'ordre des démarches
  // en fonction de la date de leur première étape
  const titreDemarchesOrdre = await titreDemarchesOrdreUpdate(titre.demarches)

  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  const titreStatutIds = await titreStatutIdsUpdate(titre)

  // détermine les phases
  // en fonction des démarches et de la date du jour
  const titresPhases = await titrePhasesUpdate(titre)

  // détermine les phases
  // en fonction des démarches et de la date du jour
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
