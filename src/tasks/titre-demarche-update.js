import '../database/index'
import { titreGet } from '../database/queries/titres'
import {
  titresDemarchesGet,
  titreDemarcheGet
} from '../database/queries/titres-demarches'

import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'

import titreDemarchesIdUpdate from './processes/titre-demarche-id-update'

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
  // id de démarche
  // en fonction du type et de l'ordre
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  titre = await titreGet(titreId)
  const titreDemarchesId = await titreDemarchesIdUpdate(titreDemarche, titre)

  // 3.
  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titresPhasesUpdate([titre])

  console.log(titreStatutIds)
  console.log(titresPhases)
  console.log(titreDemarchesId)

  console.log('Démarche mise à jour')
}

export default titreDemarcheUpdate
