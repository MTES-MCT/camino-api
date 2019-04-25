import 'dotenv/config'
import '../database/index'
import { titreGet } from '../database/queries/titres'
import {
  titresDemarchesGet,
  titreDemarcheGet
} from '../database/queries/titres-demarches'

import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'

import titreDemarchesIdUpdate from './processes/titre-demarche-id-update'

const titreDemarcheUpdate = async titreDemarcheId => {
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const { titreId } = titreDemarche
  let titre = await titreGet(titreId)

  // 1.
  // ordre des étapes
  // en fonction de leur date
  let titresDemarches = await titresDemarchesGet()
  const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresDemarches)

  // 2.
  // statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreDemarcheStatutId = await titresDemarchesStatutIdUpdate([titre])

  // 3.
  // ordre des démarches
  // en fonction de la date de leur première étape
  titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titresDemarchesOrdreUpdate([titre])

  // 4.
  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // 6.
  // id de démarche
  // en fonction du type et de l'ordre
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  titre = await titreGet(titreId)
  const titreDemarchesId = await titreDemarchesIdUpdate(titreDemarche, titre)

  // 5.
  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titresPhasesUpdate([titre])

  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titresPhases)
  console.log(titreDemarchesId)

  console.log('Démarche mise à jour')
}

export default titreDemarcheUpdate
