import { titreGet } from '../database/queries/titres'

import { titresDemarchesPublicUpdate } from './processes/titres-demarches-public-update'
import { titresActivitesUpdate } from './processes/titres-activites-update'
import { titresStatutIdsUpdate } from './processes/titres-statut-ids-update'
import { titresPropsEtapesIdsUpdate } from './processes/titres-props-etapes-ids-update'
import { titresContenusEtapesIdsUpdate } from './processes/titres-contenus-etapes-ids-update'
import { titresPhasesUpdate } from './processes/titres-phases-update'
import { titresDatesUpdate } from './processes/titres-dates-update'
import { titresDemarchesOrdreUpdate } from './processes/titres-demarches-ordre-update'
import { titresPublicUpdate } from './processes/titres-public-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import { logsUpdate } from './_logs-update'
import { titresCoordonneesUpdate } from './processes/titres-coordonnees-update'
import { titresActivitesPropsUpdate } from './processes/titres-activites-props-update'

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
    const titresPropsEtapesIdsUpdated = await titresPropsEtapesIdsUpdate([
      titreId
    ])
    const titresContenusEtapesIdsUpdated = await titresContenusEtapesIdsUpdate([
      titreId
    ])
    const titresCoordonneesUpdated = await titresCoordonneesUpdate([titreId])
    const titresActivitesCreated = await titresActivitesUpdate([titreId])
    const titresActivitesPropsUpdated = await titresActivitesPropsUpdate([
      titreId
    ])

    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }

    logsUpdate({
      titresDemarchesPublicUpdated,
      titresDemarchesOrdreUpdated,
      titresStatutIdUpdated,
      titresPublicUpdated,
      titresPhasesUpdated,
      titresPhasesDeleted,
      titresDatesUpdated,
      titresPropsEtapesIdsUpdated,
      titresContenusEtapesIdsUpdated,
      titresCoordonneesUpdated,
      titresActivitesCreated,
      titresActivitesPropsUpdated,
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
