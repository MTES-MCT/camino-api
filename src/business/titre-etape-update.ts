import { titreDemarcheGet } from '../database/queries/titres-demarches'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import { titresEtapesAreasUpdate } from './processes/titres-etapes-areas-update'
import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import titresPublicUpdate from './processes/titres-public-update'

const titreEtapeUpdate = async (
  titreEtapeId: string | null,
  titreDemarcheId: string
) => {
  try {
    let titreId
    const titreDemarche = await titreDemarcheGet(
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

    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate([
      titreDemarcheId
    ])

    titreId = titreDemarche.titreId
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate([
      titreId
    ])
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate([
      titreId
    ])
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate([
      titreId
    ])
    const titresStatutIdUpdated = await titresStatutIdsUpdate([titreId])
    const titresPublicUpdated = await titresPublicUpdate([titreId])
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate([titreId])
    const titresDatesUpdated = await titresDatesUpdate([titreId])
    console.info('communes et forêts associées aux étapes…')
    let titreCommunesUpdated = []
    let titresEtapesCommunesCreated = []
    let titresEtapesCommunesDeleted = []
    let titreForetsUpdated = []
    let titresEtapesForetsCreated = []
    let titresEtapesForetsDeleted = []
    // si l'étape est supprimée, pas de mise à jour
    if (titreEtapeId) {
      const result = await titresEtapesAreasUpdate([titreEtapeId])
      titreCommunesUpdated = result.titresCommunes[0]
      titresEtapesCommunesCreated = result.titresCommunes[1]
      titresEtapesCommunesDeleted = result.titresCommunes[2]

      titreForetsUpdated = result.titresForets[0]
      titresEtapesForetsCreated = result.titresForets[1]
      titresEtapesForetsDeleted = result.titresForets[2]
    }
    const {
      titresEtapesAdministrationsLocalesCreated = [],
      titresEtapesAdministrationsLocalesDeleted = []
    } = await titresEtapesAdministrationsLocalesUpdate([titreId])
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate([titreId])
    const titresPropsContenuUpdated = await titresPropsContenuUpdate([titreId])
    const titresActivitesCreated = await titresActivitesUpdate([titreId])

    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }

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

    if (titreForetsUpdated.length) {
      console.info(`mise à jour: ${titreForetsUpdated.length} foret(s)`)
    }

    if (titresEtapesForetsCreated.length) {
      console.info(
        `mise à jour: ${titresEtapesForetsCreated.length} foret(s) ajoutée(s) dans des étapes`
      )
    }

    if (titresEtapesForetsDeleted.length) {
      console.info(
        `mise à jour: ${titresEtapesForetsDeleted.length} foret(s) supprimée(s) dans des étapes`
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

    if (titresUpdatedIndex) {
      console.info(`mise à jour: 1 titre (id) ${titresUpdatedIndex}`)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreEtapeUpdate ${titreEtapeId}`)
    console.error(e)
    throw e
  }
}

export default titreEtapeUpdate
