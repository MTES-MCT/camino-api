import 'dotenv/config'
import '../database/index'
import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'

import titreEtapeUpdateTask from './titre-etape-update'
import titreDemarchesIdUpdate from './processes/titre-demarche-id-update'
import titresPhasesUpdate from './processes/titres-phases-update'

const titreDemarcheUpdate = async titreDemarcheId => {
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const { titreId } = titreDemarche

  const titre = await titreGet(titreId)

  const titreDemarchesId = await titreDemarchesIdUpdate(titreDemarche, titre)

  console.log(titreDemarchesId)

  console.log('Démarche mise à jour')
}

export default titreDemarcheUpdate
