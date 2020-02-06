import { dupRemove } from '../../../tools/index'
import { IEtapesTypes } from '../../../types'

const etapesTypesFormat = (et: IEtapesTypes) => {
  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (et.customSections) {
    et.sections = et.sections
      ? dupRemove('id', et.customSections, et.sections)
      : et.customSections
  }

  return et
}

export { etapesTypesFormat }
