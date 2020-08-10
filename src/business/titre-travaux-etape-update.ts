import { titreGet } from '../database/queries/titres'
import { titreTravauxGet } from '../database/queries/titres-travaux'
import titresTravauxEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import { titreIdsUpdate } from './processes/titres-ids-update'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'

const titreTravauxEtapeUpdate = async (titreTravauxId: string) => {
  try {
    let titreId
    let titre

    console.info()
    console.info('ordre des étapes de travaux…')
    const titreTravaux = await titreTravauxGet(titreTravauxId, {
      fields: {
        etapes: { id: {} },
        type: { etapesTypes: { id: {} } },
        titre: { id: {} }
      }
    })

    if (!titreTravaux) {
      throw new Error(`les travaux ${titreTravaux} n'existent pas`)
    }

    titreId = titreTravaux.titreId

    const titresTravauxEtapesOrdreUpdated = await titresTravauxEtapesOrdreUpdate(
      [titreTravaux]
    )

    console.info()
    console.info('ordre des travaux…')
    titre = await titreGet(
      titreId,
      { fields: { travaux: { etapes: { id: {} } } } },
      'super'
    )
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate([titre])

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

    if (titresTravauxEtapesOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresTravauxEtapesOrdreUpdated.length} étape(s) de travaux (ordre)`
      )
    }

    if (titresTravauxOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresTravauxOrdreUpdated.length} démarche(s) (ordre)`
      )
    }

    if (titreUpdatedIndex) {
      console.info(`mise à jour: 1 titre (id)`)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreTravauxEtapeUpdate ${titreTravauxId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxEtapeUpdate
