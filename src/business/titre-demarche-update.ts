import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'

import { activitesTypesGet } from '../database/queries/metas'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import { titreIdsUpdate } from './processes/titres-ids-update'

import { titreActivitesRowsUpdate } from './titres-activites-rows-update'

const titreDemarcheUpdate = async (
  titreDemarcheId: string | null,
  titreId: string
) => {
  try {
    let titre
    let titreDemarche

    titre = await titreGet(
      titreId,
      {
        fields: { demarches: { etapes: { id: {} } } }
      },
      'super'
    )

    if (!titre) {
      throw new Error(`warning: le titre ${titreId} n'existe plus`)
    }

    let titresDemarchesPublicUpdated

    if (titreDemarcheId) {
      console.info()
      console.info('publicité des démarches…')
      titreDemarche = await titreDemarcheGet(
        titreDemarcheId,
        { fields: { etapes: { id: {} } } },
        'super'
      )
      titre = await titreGet(
        titreId,
        {
          fields: {
            demarches: {
              type: { etapesTypes: { id: {} } },
              etapes: { id: {} }
            }
          }
        },
        'super'
      )
      titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate([
        titre
      ])
    }

    console.info('ordre des démarches…')

    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate([
      titre
    ])

    console.info('statut des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: { demarches: { etapes: { points: { id: {} } } } }
      },
      'super'
    )
    const titresStatutIdUpdated = await titresStatutIdsUpdate([titre])

    console.info('phases des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: { demarches: { etapes: { points: { id: {} } } } }
      },
      'super'
    )
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate([titre])

    console.info('date de début, de fin et de demande initiale des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: { demarches: { etapes: { points: { id: {} } } } }
      },
      'super'
    )
    const titresDatesUpdated = await titresDatesUpdate([titre])

    console.info('propriétés des titres (liens vers les étapes)…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          demarches: {
            etapes: {
              points: { id: {} },
              titulaires: { id: {} },
              amodiataires: { id: {} },
              administrations: { id: {} },
              substances: { id: {} },
              communes: { id: {} }
            }
          }
        }
      },
      'super'
    )
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate([titre])

    console.info(`propriétés des titres (liens vers les contenus d'étapes)…`)
    titre = await titreGet(
      titreId,
      {
        fields: { demarches: { etapes: { id: {} } } }
      },
      'super'
    )
    const titresPropsContenuUpdated = await titresPropsContenuUpdate([titre])

    console.info()
    console.info('activités des titres…')

    titre = await titreGet(
      titreId,
      {
        fields: {
          demarches: { phase: { id: {} } },
          communes: { departement: { region: { pays: { id: {} } } } },
          activites: { id: {} }
        }
      },
      'super'
    )
    const activitesTypes = await activitesTypesGet({}, 'super')
    const titresActivitesCreated = await titresActivitesUpdate(
      [titre],
      activitesTypes
    )

    console.info('ids de titres, démarches, étapes et sous-éléments…')
    titre = await titreGet(titreId, {}, 'super')
    const titreUpdatedIndex = await titreIdsUpdate(titre)
    titreId = titreUpdatedIndex ? Object.keys(titreUpdatedIndex)[0] : titreId

    if (titresDemarchesPublicUpdated) {
      console.info(
        `mise à jour: ${titresDemarchesPublicUpdated.length} démarche(s) (publicicité)`
      )
    }
    console.info(
      `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
    )
    console.info(
      `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
    )
    console.info(
      `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
    )
    console.info(
      `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
    )
    console.info(
      `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
    )
    console.info(
      `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
    )
    console.info(
      `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
    )
    console.info(`mise à jour: ${titresActivitesCreated.length} activités`)
    console.info(`mise à jour: ${titreUpdatedIndex ? '1' : '0'} titre(s) (ids)`)

    if (titresActivitesCreated.length) {
      // export des activités vers la spreadsheet camino-db-titres-activites-prod
      console.info('export des activités…')
      await titreActivitesRowsUpdate(titresActivitesCreated, titreUpdatedIndex)
    }

    // on retourne le titre bien formaté
    return titreId
  } catch (e) {
    console.error(`erreur: titreDemarcheUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreDemarcheUpdate
