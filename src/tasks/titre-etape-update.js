import 'dotenv/config'
import '../database/index'
import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'
import { titreEtapeGet } from '../database/queries/titres-etapes'
import { communesGet } from '../database/queries/territoires'

import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresEtapeCommunesUpdate from './processes/titres-etapes-communes-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titreEtapesIdUpdate from './processes/titre-etape-id-update'
import titreDemarchesIdUpdate from './processes/titre-demarches-id-update'

const titreEtapeUpdate = async (titreEtapeId, titreDemarcheId) => {
  // ordre des étapes
  // en fonction de leur date
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreEtapesOrdre = await titresEtapesOrdreUpdate([titreDemarche])

  // statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreDemarcheStatutId = await titresDemarchesStatutIdUpdate([
    {
      demarches: [titreDemarche]
    }
  ])

  // ordre des démarches
  // en fonction de la date de leur première étape
  const { titreId } = titreDemarche
  let titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titresDemarchesOrdreUpdate([titre])

  // id de démarche
  // en fonction du type et de l'ordre
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  titre = await titreGet(titreId)
  const titreDemarchesId = await titreDemarchesIdUpdate(titreDemarche, titre)

  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titresPhasesUpdate([titre])

  // communes associées aux étapes
  let titreEtape = await titreEtapeGet(titreEtapeId, titreDemarcheId)
  const communes = await communesGet()
  const titresEtapesCommunes = await titresEtapeCommunesUpdate(
    [titreEtape],
    communes
  )

  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // met à jour l'id des étapes
  titreEtape = await titreEtapeGet(titreEtapeId, titreDemarcheId)
  titre = await titreGet(titreId)
  const titreEtapesId = await titreEtapesIdUpdate(titreEtape, titre)

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreDemarchesId)
  console.log(titreStatutIds)
  console.log(titresPhases)
  console.log(titresEtapesCommunes.join('\n'))
  console.log(titresPropsEtapeId)
  console.log(titreEtapesId.join('\n'))

  console.log('Étape mise à jour')
}

export default titreEtapeUpdate
