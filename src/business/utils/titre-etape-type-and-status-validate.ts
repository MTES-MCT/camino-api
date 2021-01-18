import { IEtapeType } from '../../types'

// valide le type et le statut de l'étape en fonction des type d'étapes d'une démarche
import { titreEtapeDemarcheEtapeTypeFind } from './titre-etape-demarche-etape-type-find'

const titreEtapeTypeAndStatusValidate = (
  etapeTypeId: string,
  etapeStatutId: string,
  etapesTypes: IEtapeType[],
  demarcheTypeNom: string
) => {
  try {
    const etapeType = titreEtapeDemarcheEtapeTypeFind(
      etapeTypeId,
      etapesTypes,
      demarcheTypeNom
    )

    const titreEtapeStatut = etapeType.etapesStatuts!.find(
      etapeStatut => etapeStatut.id === etapeStatutId
    )

    if (!titreEtapeStatut) {
      return [
        `statut de l'étape "${etapeStatutId}" invalide pour une type d'étape ${etapeTypeId} pour une démarche de type ${demarcheTypeNom}`
      ]
    }

    return []
  } catch (e) {
    return [e.message]
  }
}

export { titreEtapeTypeAndStatusValidate }
