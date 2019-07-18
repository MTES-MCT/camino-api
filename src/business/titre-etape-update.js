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
import titresDatesUpdate from './processes/titres-dates-update'
import titresEtapeCommunesUpdate from './processes/titres-etapes-communes-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titreIdUpdate from './processes/titre-id-update'

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

  // statut du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titresStatutIdsUpdate([titre])

  // phases du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titrePhases = await titresPhasesUpdate([titre])

  // date de début, de fin et de demande initiale d'un titre
  titre = await titreGet(titreId)
  const titreDates = await titresDatesUpdate([titre])

  // communes associées à l'étapes
  let titreEtapesCommunes
  // si l'étape est supprimée, pas de mise à jour
  if (titreEtapeId) {
    const titreEtape = await titreEtapeGet(titreEtapeId, titreDemarcheId)
    const communes = await communesGet()
    titreEtapesCommunes = await titresEtapeCommunesUpdate(
      [titreEtape],
      communes
    )
  }

  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titrePropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // met à jour l'id des étapes
  // met à jour l'id du titres, des démarches et des étapes
  titre = await titreGet(titreId, { format: false })
  const titreNew = await titreIdUpdate(titre)

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreStatutIds)
  console.log(titrePhases)
  console.log(titreDates)
  if (titreEtapesCommunes) {
    console.log(titreEtapesCommunes.join('\n'))
  }
  console.log(titrePropsEtapeId)

  console.log('Étape mise à jour')

  return titreGet(titreNew.id)
}

export default titreEtapeUpdate
