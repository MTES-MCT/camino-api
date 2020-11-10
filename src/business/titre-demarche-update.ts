import { titreGet } from '../database/queries/titres'

import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresPublicUpdate from './processes/titres-public-update'
import { titresIdsUpdate } from './processes/titres-ids-update'

const titreDemarcheUpdate = async (
  titreDemarcheId: string | null,
  titreId: string
) => {
  try {
    const titre = await titreGet(
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
      titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate([
        titreId
      ])
    }

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
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate([titreId])
    const titresPropsContenuUpdated = await titresPropsContenuUpdate([titreId])
    const titresActivitesCreated = await titresActivitesUpdate([titreId])

    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }

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

    if (titresUpdatedIndex) {
      console.info(`mise à jour: 1 titre (id) ${titresUpdatedIndex}`)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreDemarcheUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreDemarcheUpdate
