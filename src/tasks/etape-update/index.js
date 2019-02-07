import 'dotenv/config'
import '../../database/index'
import { titreGet } from '../../database/queries/titres'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { communesGet } from '../../database/queries/communes'

import titreEtapesOrdreUpdate from './titre-etapes-ordre-update'
import titreDemarcheStatutIdUpdate from './titre-demarche-statut-id-update'
import titreDemarchesOrdreUpdate from './titre-demarches-ordre-update'
import titreStatutIdsUpdate from './titre-statut-id-update'
import titrePhasesUpdate from './titre-phases-update'
import titreEtapeCommunesUpdate from './titre-etape-communes-update'
import titrePropsEtapeIdUpdate from './titre-props-etape-id-update'

const titreUpdate = async titreEtapeId => {
  // ordre des étapes
  // en fonction de leur date

  const titreEtape = await titreEtapeGet(titreEtapeId)
  const titreDemarcheId = titreEtape.titreDemarcheId
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titreId = titreDemarche.titreId
  const titreEtapesOrdre = await titreEtapesOrdreUpdate(titreDemarche)

  // statut de la démarche
  // en fonction de ses étapes (type, ordre, statut)

  titreDemarche = await titreDemarcheGet(titreDemarcheId)
  let titre = await titreGet(titreId)
  const titreTypeId = titre.typeId
  const titreDemarcheStatutId = await titreDemarcheStatutIdUpdate(
    titreDemarche,
    titreTypeId
  )

  // ordre des démarches
  // en fonction de la date de leur première étape
  titre = await titreGet(titreId)
  const titreDemarchesOrdre = await titreDemarchesOrdreUpdate(titre.demarches)

  // statut des titres
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titreStatutIds = await titreStatutIdsUpdate(titre)

  // phases
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPhases = await titrePhasesUpdate(titre)

  // communes associées aux étapes
  const communes = await communesGet()
  const titresEtapesCommunes = await titreEtapeCommunesUpdate(
    titreEtape,
    communes
  )

  // propriétés du titre
  // en fonction des démarches et de la date du jour
  titre = await titreGet(titreId)
  const titresPropsEtapeId = await titrePropsEtapeIdUpdate(titre)

  console.log(titreEtapesOrdre)
  console.log(titreDemarcheStatutId)
  console.log(titreDemarchesOrdre)
  console.log(titreStatutIds)
  console.log(titresPhases)
  console.log(titresEtapesCommunes)
  console.log(titresPropsEtapeId)

  console.log('Étape mise à jour')
}

export default titreUpdate
