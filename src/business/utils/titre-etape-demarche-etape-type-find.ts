import { IEtapeType } from '../../types'

const titreEtapeDemarcheEtapeTypeFind = (
  etapeTypeId: string,
  etapesTypes: IEtapeType[],
  demarcheTypeNom: string
) => {
  const titreDemarcheEtapeType = etapesTypes.find(
    ({ id }) => id === etapeTypeId
  )

  if (!titreDemarcheEtapeType) {
    throw new Error(
      `étape "${etapeTypeId}" invalide pour une démarche "${demarcheTypeNom}"`
    )
  }

  return titreDemarcheEtapeType
}

export { titreEtapeDemarcheEtapeTypeFind }
