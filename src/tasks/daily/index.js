import 'dotenv/config'
import '../../database/index'

import { titresGet } from '../../database/queries/titres'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titresPhasesGet } from '../../database/queries/titres-phases'
import { titresEtapesGet } from '../../database/queries/titres-etapes'
import { communesGet } from '../../database/queries/communes'

import titresEtapesOrdreUpdate from './titres-etapes-ordre-update'
import titresDemarchesStatutIdUpdate from './titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './titres-demarches-ordre-update'
import titresStatutIdsUpdate from './titres-statut-ids-update'
import titresPhasesUpdate from './titres-phases-update'
import titresEtapesCommunesUpdate from './titres-etapes-communes-update'
import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'

const run = async () => {
  // 1.
  // ordre des étapes
  // en fonction de leur date
  let titresEtapes = await titresEtapesGet({})
  const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresEtapes)

  // 2.
  // statut des démarches
  // en fonction de ses étapes (type, ordre, statut)
  let titres = await titresGet({})
  let titresDemarches = await titresDemarchesGet({})
  const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(
    titresDemarches,
    titres
  )

  // 3.
  // détermine l'ordre des démarche
  // en fonction de la date de leur première étape
  titresDemarches = await titresDemarchesGet({})
  const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titresDemarches)

  // 4.
  // statut des titres
  // en fonction des démarches et de la date du jour
  titres = await titresGet({})
  const titresStatutIds = await titresStatutIdsUpdate(titres)

  // 5.
  // phases des titres
  // en fonction des démarches et de la date du jour
  titres = await titresGet({})
  titresDemarches = await titresDemarchesGet({})
  const titresPhasesOld = await titresPhasesGet()
  const titresPhases = await titresPhasesUpdate(
    titres,
    titresDemarches,
    titresPhasesOld
  )

  // 6.
  // communes associées aux étapes
  titresEtapes = await titresEtapesGet({})
  const communes = await communesGet()
  const titresEtapesCommunes = await titresEtapesCommunesUpdate(
    titresEtapes,
    communes
  )

  // 7.
  // propriétés des titres
  // en fonction de la chronologie des démarches
  titres = await titresGet({})
  const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

  // logs
  console.log(titresEtapesOrdre)
  console.log(titresDemarchesStatutId)
  console.log(titresDemarchesOrdre)
  console.log(titresStatutIds)
  console.log(titresPhases)
  titresEtapesCommunes.forEach(log => {
    console.log(log)
  })
  console.log(titresPropsEtapeId)

  console.log('Tâches quotidiennes executées')
  process.exit()
}

run()
