import { IDemarcheType } from '../../types'

const titreEtapeDemarcheEtapeTypeFind = (
  demarcheType: IDemarcheType,
  titreEtapeTypeId: string
) => {
  const {
    etapesTypes: titreDemarcheEtapesTypes,
    nom: titreDemarcheTypeNom
  } = demarcheType

  const titreDemarcheEtapeType = titreDemarcheEtapesTypes.find(
    ({ id }) => id === titreEtapeTypeId
  )

  if (!titreDemarcheEtapeType) {
    throw new Error(
      `étape "${titreEtapeTypeId}" invalide pour une démarche "${titreDemarcheTypeNom}"`
    )
  }

  return titreDemarcheEtapeType
}

export default titreEtapeDemarcheEtapeTypeFind
