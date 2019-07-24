import '../database/index'
import { titreGet } from '../database/queries/titres'

import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import { titreIdsUpdate } from './processes/titres-ids-update'

const titreDemarcheUpdate = async titreId => {
  // 3.
  // ordre des démarches
  // en fonction de la date de leur première étape
  let titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titresDemarchesOrdreUpdate([titre])

  // 4.
  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // 5.
  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titrePhases = await titresPhasesUpdate([titre])

  // 6.
  // date de début, de fin et de demande initiale d'un titre
  titre = await titreGet(titreId)
  const titreDates = await titresDatesUpdate([titre])

  // 9.
  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // 12.
  // id du titres, des démarches et des étapes
  titre = await titreGet(titreId, { format: false })
  // titreNew n'est pas formaté
  const titreNew = await titreIdsUpdate(titre)

  console.log(titreDemarchesOrdre)
  console.log(titresPropsEtapeId)
  console.log(titreStatutIds)
  console.log(titrePhases)
  console.log(titreDates)

  console.log('Démarche mise à jour')

  // on retourne le titre bien formaté
  return titreGet(titreNew.id)
}

export default titreDemarcheUpdate
