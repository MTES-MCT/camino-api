import '../database/index'
import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'

import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titreDemarchesIdUpdate from './processes/titre-demarche-id-update'
import titresPhasesUpdate from './processes/titres-phases-update'

const titreDemarcheUpdate = async titreDemarcheId => {
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const { titreId } = titreDemarche
  let titre = await titreGet(titreId)

  // 1.
  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // 2.
  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // 3.
  // id de démarche
  // en fonction du type et de l'ordre
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  titre = await titreGet(titreId)
  const titreDemarchesId = await titreDemarchesIdUpdate(titreDemarche, titre)

  // 4.
  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titresPhasesUpdate([titre])

  console.log(titreStatutIds)
  console.log(titresPropsEtapeId)
  console.log(titreDemarchesId.join('\n'))
  console.log(titresPhases)

  console.log('Démarche mise à jour')
}

export default titreDemarcheUpdate
