import { IEtapeType } from '../../types'

// valide le type et le statut de l'étape en fonction des type d'étapes d'une démarche
import { titreEtapeDemarcheEtapeTypeFind } from '../utils/titre-etape-demarche-etape-type-find'

const titreEtapeTypeAndStatusValidate = (
  etapeTypeId: string,
  etapeStatutId: string | undefined,
  etapesTypes: IEtapeType[],
  demarcheTypeNom: string
) => {
  try {
    if (!etapeStatutId) {
      return [`le statut est obligatoire`]
    }

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
  } catch (e: any) {
    return [e.message]
  }
}

export { titreEtapeTypeAndStatusValidate }
