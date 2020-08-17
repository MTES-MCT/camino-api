import { titreGet } from '../database/queries/titres'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'
import { titreIdsUpdate } from './processes/titres-ids-update'

const titreTravauxUpdate = async (titreId: string) => {
  try {
    let titre = await titreGet(
      titreId,
      {
        fields: { travaux: { etapes: { id: {} } } }
      },
      'super'
    )

    if (!titre) {
      throw new Error(`warning: le titre ${titreId} n'existe plus`)
    }

    console.info()
    console.info(`ordre des travaux…`)
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate([titre])

    console.info('ids des travaux')
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
    await titreIdsUpdate(titre)

    console.info()
    console.info('tâches métiers exécutées:')

    if (titresTravauxOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresTravauxOrdreUpdated.length} travaux (ordre)`
      )
    }

    return titre.id
  } catch (e) {
    console.error(`erreur: titreTravauxUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxUpdate
