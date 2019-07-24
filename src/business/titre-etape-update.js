import 'dotenv/config'
import '../database/index'

import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'
import { titreEtapeGet } from '../database/queries/titres-etapes'
import { communesGet } from '../database/queries/territoires'
import { administrationsGet } from '../database/queries/administrations'

import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresEtapeCommunesUpdate from './processes/titres-etapes-communes-update'
import titresEtapesAdministrationsUpdate from './processes/titres-etapes-administrations-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'

import { titreIdsUpdate } from './processes/titres-ids-update'

const titreEtapeUpdate = async (titreEtapeId, titreDemarcheId) => {
  // 1.
  // ordre des étapes
  // en fonction de leur date
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreEtapesOrdre = await titresEtapesOrdreUpdate([titreDemarche])

  // 2.
  // statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)
  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreDemarcheStatutId = await titresDemarchesStatutIdUpdate([
    {
      demarches: [titreDemarche]
    }
  ])

  // 3.
  // ordre des démarches
  // en fonction de la date de leur première étape
  const { titreId } = titreDemarche
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

  // 7.
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

  // 8.
  // administrations associées aux étapes
  titre = await titreGet(titreId)
  const administrations = await administrationsGet()
  const titresEtapesAdministrations = await titresEtapesAdministrationsUpdate(
    [titre],
    administrations
  )

  // 9.
  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titrePropsEtapeId = await titresPropsEtapeIdUpdate([titre])

  // TODO
  // doit-on aussi créer des activités ?

  // 12.
  // met à jour l'id du titres, des démarches et des étapes
  titre = await titreGet(titreId, { format: false })
  const titreNew = await titreIdsUpdate(titre)

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreStatutIds)
  console.log(titrePhases)
  console.log(titreDates)
  if (titreEtapesCommunes) {
    console.log(titreEtapesCommunes.join('\n'))
  }
  console.log(titresEtapesAdministrations.join('\n'))
  console.log(titrePropsEtapeId)

  console.log('Étape mise à jour')

  // on récupère le titre bien formaté
  return titreGet(titreNew.id)
}

export default titreEtapeUpdate
