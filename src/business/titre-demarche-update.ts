import { titreGet } from '../database/queries/titres'

import { activitesTypesGet } from '../database/queries/metas'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresPublicUpdate from './processes/titres-public-update'
import { titreIdsUpdate } from './processes/titres-ids-update'

const titreDemarcheUpdate = async (
  titreDemarcheId: string | null,
  titreId: string
) => {
  try {
    let titre

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

    // si c'est une création ou modification
    // pas une suppression
    if (titreDemarcheId) {
      console.info()
      console.info('publicité des démarches…')
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
      titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate([titre])
    }

    console.info('ordre des démarches…')

    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate([
      titre
    ])

    console.info('statut des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresStatutIdUpdated = await titresStatutIdsUpdate([titre])

    console.info()
    console.info('publicité des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          type: { autorisationsTitresStatuts: { id: {} } },
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresPublicUpdated = await titresPublicUpdate([titre])

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
    // si l'id du titre change il est effacé puis re-créé entièrement
    // on doit donc récupérer toutes ses relations
    titre = await titreGet(
      titreId,
      {
        fields: {
          type: { type: { id: {} } },
          references: { id: {} },
          administrationsGestionnaires: { id: {} },
          demarches: {
            etapes: {
              points: { references: { id: {} } },
              documents: { id: {} },
              administrations: { id: {} },
              titulaires: { id: {} },
              amodiataires: { id: {} },
              substances: { id: {} },
              communes: { id: {} },
              justificatifs: { id: {} },
              incertitudes: { id: {} }
            },
            phase: { id: {} }
          },
          travaux: { etapes: { id: {} } },
          activites: { id: {} }
        }
      },
      'super'
    )

    // met à jour l'id dans le titre par effet de bord
    const titreUpdatedIndex = await titreIdsUpdate(titre)
    titreId = titreUpdatedIndex ? Object.keys(titreUpdatedIndex)[0] : titreId

    if (titresDemarchesPublicUpdated && titresDemarchesPublicUpdated.length) {
      console.info(
        `mise à jour: ${titresDemarchesPublicUpdated.length} démarche(s) (publicicité)`
      )
    }

    if (titresDemarchesOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
      )
    }

    if (titresStatutIdUpdated.length) {
      console.info(
        `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
      )
    }

    if (titresPublicUpdated.length) {
      console.info(
        `mise à jour: ${titresPublicUpdated.length} titre(s) (publicité)`
      )
    }

    if (titresPhasesUpdated.length) {
      console.info(
        `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
      )
    }

    if (titresPhasesDeleted.length) {
      console.info(
        `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
      )
    }

    if (titresDatesUpdated.length) {
      console.info(
        `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
      )
    }

    if (titresPropsEtapeIdUpdated.length) {
      console.info(
        `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
      )
    }

    if (titresPropsContenuUpdated.length) {
      console.info(
        `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
      )
    }

    if (titresActivitesCreated.length) {
      console.info(`mise à jour: ${titresActivitesCreated.length} activité(s)`)
    }

    if (titreUpdatedIndex) {
      console.info(`mise à jour: 1 titre (id)`)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreDemarcheUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreDemarcheUpdate
