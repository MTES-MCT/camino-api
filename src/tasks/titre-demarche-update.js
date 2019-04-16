import 'dotenv/config'
import '../database/index'
import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'

import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'

import titreDemarchesIdUpdate from './processes/titre-demarche-id-update'

const titreDemarcheUpdate = async titreDemarcheId => {
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const { titreId } = titreDemarche

  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreDemarcheStatutId = await titresDemarchesStatutIdUpdate([
    {
      demarches: [titreDemarche]
    }
  ])

  // ordre des démarches
  // en fonction de la date de leur première étape
  let titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titresDemarchesOrdreUpdate([titre])

  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titresPhasesUpdate([titre])

  // met à jour l'id de la démarche
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  titre = await titreGet(titreId)
  const titreDemarchesId = await titreDemarchesIdUpdate(titreDemarche, titre)

  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titresPhases)
  console.log(titreDemarchesId.join('\n'))

  console.log('Démarche mise à jour')
}

export default titreDemarcheUpdate
