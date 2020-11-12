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
import updatesLog from './_updates-log'

const titreDemarcheUpdate = async (
  titreDemarcheId: string | null,
  titreId: string
) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour d'une démarche : ${titreDemarcheId}`)

    const titre = await titreGet(
      titreId,
      { fields: { demarches: { etapes: { id: {} } } } },
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

    updatesLog({
      titresDemarchesPublicUpdated,
      titresDemarchesOrdreUpdated,
      titresStatutIdUpdated,
      titresPublicUpdated,
      titresPhasesUpdated,
      titresPhasesDeleted,
      titresDatesUpdated,
      titresPropsEtapeIdUpdated,
      titresPropsContenuUpdated,
      titresActivitesCreated,
      titresUpdatedIndex
    })

    return titreId
  } catch (e) {
    console.error(`erreur: titreDemarcheUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreDemarcheUpdate
