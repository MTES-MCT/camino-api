import {
  ITitre,
  ITitreDemarche,
  IEtapeType,
  IUtilisateur
} from '../../../types'

import { etapeTypeFormat } from './etapes-types'

const etapeTypesFormat = (
  user: IUtilisateur | undefined,
  titre: ITitre,
  demarche: ITitreDemarche,
  etapeTypeId?: string
) => {
  const { typeId: demarcheTypeId, type: demarcheType } = demarche

  if (!demarcheType || !demarcheType.etapesTypes) {
    throw new Error(`${demarcheTypeId} inexistant`)
  }

  return demarcheType.etapesTypes
    .sort((a, b) => a.ordre - b.ordre)
    .reduce((etapesTypes: IEtapeType[], et) => {
      const etapeType = etapeTypeFormat(et, titre, demarche, etapeTypeId)

      if (etapeType) {
        etapesTypes.push(etapeType)
      }

      return etapesTypes
    }, [])
}

export { etapeTypesFormat }
