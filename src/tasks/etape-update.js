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

const titreUpdate = async titreEtapeId => {
  // ordre des étapes
  // en fonction de leur date

  const titreEtape = await titreEtapeGet(titreEtapeId)
  const { titreDemarcheId } = titreEtape
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const { titreId } = titreDemarche
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

  // communes associées aux étapes
  const communes = await communesGet()
  const titresEtapesCommunes = await titresEtapeCommunesUpdate(
    [titreEtape],
    communes
  )

  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreStatutIds)
  console.log(titresPhases)
  titresEtapesCommunes.forEach(log => console.log(log))
  console.log(titresPropsEtapeId)

  console.log('Étape mise à jour')
}

export default titreUpdate
