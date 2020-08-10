import { activitesTypesGet } from '../database/queries/metas'
import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'
import { titreEtapeGet } from '../database/queries/titres-etapes'
import { communesGet } from '../database/queries/territoires'
import { administrationsGet } from '../database/queries/administrations'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresEtapeCommunesUpdate from './processes/titres-etapes-communes-update'
import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import { titreIdsUpdate } from './processes/titres-ids-update'

const titreEtapeUpdate = async (
  titreEtapeId: string | null,
  titreDemarcheId: string
) => {
  try {
    let titreDemarche
    let titreId
    let titre

    console.info()
    console.info('ordre des étapes…')
    titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      {
        fields: {
          etapes: { id: {} },
          type: { etapesTypes: { id: {} } },
          titre: { id: {} }
        }
      },
      'super'
    )

    if (!titreDemarche) {
      throw new Error(`la démarche ${titreDemarche} n'existe pas`)
    }

    titreId = titreDemarche.titreId

    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate([
      titreDemarche
    ])

    console.info()
    console.info('statut des démarches…')
    titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      { fields: { etapes: { id: {} } } },
      'super'
    )
    titre = await titreGet(
      titreId,
      { fields: { demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate([
      titre
    ])

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
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate([
      titre
    ])

    console.info()
    console.info('ordre des démarches…')
    titre = await titreGet(
      titreId,
      { fields: { demarches: { etapes: { points: { id: {} } } } } },
      'super'
    )
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate([
      titre
    ])

    console.info()
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
    console.info('phases des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate([titre])

    console.info()
    console.info('date de début, de fin et de demande initiale des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: { demarches: { etapes: { points: { id: {} } } } }
      },
      'super'
    )
    const titresDatesUpdated = await titresDatesUpdate([titre])

    console.info()
    console.info('communes associées aux étapes…')
    let titreCommunesUpdated = []
    let titresEtapesCommunesCreated = []
    let titresEtapesCommunesDeleted = []
    // si l'étape est supprimée, pas de mise à jour
    if (titreEtapeId) {
      const titreEtape = await titreEtapeGet(
        titreEtapeId,
        { fields: { points: { id: {} }, communes: { id: {} } } },
        'super'
      )
      const communes = await communesGet()
      const result = await titresEtapeCommunesUpdate([titreEtape], communes)
      titreCommunesUpdated = result[0]
      titresEtapesCommunesCreated = result[1]
      titresEtapesCommunesDeleted = result[2]
    }

    console.info()
    console.info('administrations locales associées aux étapes…')
    let administrations = await administrationsGet({}, {}, 'super')
    titre = await titreGet(
      titreId,
      {
        fields: {
          demarches: {
            etapes: {
              administrations: { titresTypes: { id: {} } },
              communes: { departement: { id: {} } }
            }
          }
        }
      },
      'super'
    )
    administrations = await administrationsGet({}, {}, 'super')
    const [
      titresEtapesAdministrationsLocalesCreated = [],
      titresEtapesAdministrationsLocalesDeleted = []
    ] = await titresEtapesAdministrationsLocalesUpdate([titre], administrations)

    console.info()
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

    console.info()
    console.info(`propriétés des titres (liens vers les contenus d'étapes)…`)
    titre = await titreGet(
      titreId,
      { fields: { type: { id: {} }, demarches: { etapes: { id: {} } } } },
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

    console.info()
    console.info('ids de titres, démarches, étapes et sous-éléments…')
    // si l'id du titre change il est effacé puis re-créé entièrement
    // on doit donc récupérer toutes ses relations
    titre = await titreGet(
      titreId,
      {
        fields: {
          type: { type: { id: {} } },
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

    if (titresEtapesOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresEtapesOrdreUpdated.length} étape(s) (ordre)`
      )
    }

    if (titresDemarchesStatutUpdated.length) {
      console.info(
        `mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut)`
      )
    }

    if (titresDemarchesPublicUpdated.length) {
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

    if (titreCommunesUpdated.length) {
      console.info(`mise à jour: ${titreCommunesUpdated.length} commune(s)`)
    }

    if (titresEtapesCommunesCreated.length) {
      console.info(
        `mise à jour: ${titresEtapesCommunesCreated.length} commune(s) ajoutée(s) dans des étapes`
      )
    }

    if (titresEtapesCommunesDeleted.length) {
      console.info(
        `mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes`
      )
    }

    if (titresEtapesAdministrationsLocalesCreated.length) {
      console.info(
        `mise à jour: ${titresEtapesAdministrationsLocalesCreated.length} administration(s) locale(s) ajoutée(s) dans des étapes`
      )
    }

    if (titresEtapesAdministrationsLocalesDeleted.length) {
      console.info(
        `mise à jour: ${titresEtapesAdministrationsLocalesDeleted.length} administration(s) locale(s) supprimée(s) dans des étapes`
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
    console.error(`erreur: titreEtapeUpdate ${titreEtapeId}`)
    console.error(e)
    throw e
  }
}

export default titreEtapeUpdate
