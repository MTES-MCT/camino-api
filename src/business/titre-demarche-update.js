import '../database/index'
import { titreGet } from '../database/queries/titres'

import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titreIdUpdate from './processes/titre-id-update'

const titreDemarcheUpdate = async (titreDemarcheId, titreId) => {
  // 1.
  // ordre des démarches
  // en fonction de la date de leur première étape
  let titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titresDemarchesOrdreUpdate([titre])

  // 2.
  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // 3.
  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // 4.
  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titrePhases = await titresPhasesUpdate([titre])

  // 5.
  // date de début, de fin et de demande initiale d'un titre
  titre = await titreGet(titreId)
  const titreDates = await titresDatesUpdate([titre])

  // 6.
  // id du titre
  // met à jour l'id du titres, des démarches et des étapes
  titre = await titreGet(titreId, { format: false })
  const titreNew = await titreIdUpdate(titre)

  console.log(titreDemarchesOrdre)
  console.log(titresPropsEtapeId)
  console.log(titreStatutIds)
  console.log(titrePhases)
  console.log(titreDates)

  console.log('Démarche mise à jour')

  return titreGet(titreNew.id)
}

export default titreDemarcheUpdate
