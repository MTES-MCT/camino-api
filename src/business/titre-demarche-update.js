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
  console.log('ordre des démarches…')
  let titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titresDemarchesOrdreUpdate([titre])

  // 4.
  console.log('statut des titres…')
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // 5.
  console.log('phases des titres…')
  titre = await titreGet(titreId)
  const titrePhases = await titresPhasesUpdate([titre])

  // 6.
  console.log('date de début, de fin et de demande initiale des titres…')
  titre = await titreGet(titreId)
  const titreDates = await titresDatesUpdate([titre])

  // 10.
  console.log('propriétés des titres (liens vers les étapes)…')
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // 13.
  console.log('ids de titres, démarches, étapes et sous-éléments…')
  titre = await titreGet(titreId, { format: false })
  // titreNew n'est pas formaté
  const titreNew = await titreIdsUpdate(titre)

  console.log(titreDemarchesOrdre)
  console.log(titresPropsEtapeId)
  console.log(titreStatutIds)
  console.log(titrePhases)
  console.log(titreDates)

  // on retourne le titre bien formaté
  return titreGet(titreNew.id)
}

export default titreDemarcheUpdate
