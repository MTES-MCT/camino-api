import { titreGet } from '../database/queries/titres'

import { activitesTypesGet } from '../database/queries/metas'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import { titreIdsUpdate } from './processes/titres-ids-update'

import { titreActivitesRowsUpdate } from './titres-activites-rows-update'

const titreDemarcheUpdate = async (titreId: string) => {
  try {
    let titre = await titreGet(titreId, {
      graph: 'demarches(orderDesc).[etapes(orderDesc)]'
    })
    if (!titre) {
      console.log(`warning: le titre ${titreId} n'existe plus`)

      return null
    }

    // 3.
    console.log('ordre des démarches…')

    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate([
      titre
    ])

    // 4.
    console.log('statut des titres…')
    titre = await titreGet(titreId, {
      graph: 'demarches(orderDesc).[etapes(orderDesc).[points]]'
    })
    const titresStatutIdUpdated = await titresStatutIdsUpdate([titre])

    // 5.
    console.log('phases des titres…')
    titre = await titreGet(titreId, {
      graph: 'demarches(orderDesc).[phase,etapes(orderDesc).[points]]'
    })
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate([titre])

    // 6.
    console.log('date de début, de fin et de demande initiale des titres…')
    titre = await titreGet(titreId, {
      graph: 'demarches(orderDesc).[etapes(orderDesc).[points]]'
    })
    const titresDatesUpdated = await titresDatesUpdate([titre])

    // 11.
    console.log('propriétés des titres (liens vers les étapes)…')
    titre = await titreGet(titreId, {
      graph:
        'demarches(orderDesc).[etapes(orderDesc).[points, titulaires, amodiataires, administrations, substances, communes]]'
    })
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate([titre])

    // 12.
    console.log(`propriétés des titres (liens vers les contenus d'étapes)…`)
    titre = await titreGet(titreId, {
      graph: '[type, demarches(orderDesc).[etapes(orderDesc)]]'
    })
    const titresPropsContenuUpdated = await titresPropsContenuUpdate([titre])

    // 13.
    // pour les année 2018 et 2019 (en dur)
    console.log()
    console.log('activités des titres…')

    titre = await titreGet(titreId, { graph: 'demarches(orderDesc).[phase]' })
    const activitesTypes = await activitesTypesGet()
    const titresActivitesCreated = await titresActivitesUpdate(
      [titre],
      activitesTypes
    )

    // 14.
    console.log('ids de titres, démarches, étapes et sous-éléments…')
    titre = await titreGet(titreId)
    const titreUpdatedIndex = await titreIdsUpdate(titre)
    titreId = titreUpdatedIndex ? Object.keys(titreUpdatedIndex)[0] : titreId

    console.log(
      `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
    )
    console.log(
      `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
    )
    console.log(
      `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
    )
    console.log(
      `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
    )
    console.log(
      `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
    )
    console.log(
      `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
    )
    console.log(
      `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
    )
    console.log(`mise à jour: ${titresActivitesCreated.length} activités`)
    console.log(`mise à jour: ${titreUpdatedIndex ? '1' : '0'} titre(s) (ids)`)

    if (titresActivitesCreated.length) {
      // export des activités vers la spreadsheet camino-db-titres-activites-prod
      console.log('export des activités…')
      await titreActivitesRowsUpdate(titresActivitesCreated, titreUpdatedIndex)
    }

    // on retourne le titre bien formaté
    return titreGet(titreId)
  } catch (e) {
    console.error(`erreur: titreDemarcheUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreDemarcheUpdate
