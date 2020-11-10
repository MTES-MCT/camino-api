import { titreTravauxGet } from '../database/queries/titres-travaux'
import titresTravauxEtapesOrdreUpdate from './processes/titres-travaux-etapes-ordre-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'

const titreTravauxEtapeUpdate = async (titreTravauxId: string) => {
  try {
    let titreId
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
      [titreTravauxId]
    )
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate([titreId])
    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }

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

    if (titresUpdatedIndex) {
      console.info(`mise à jour: 1 titre (id) ${titresUpdatedIndex}`)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreTravauxEtapeUpdate ${titreTravauxId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxEtapeUpdate
