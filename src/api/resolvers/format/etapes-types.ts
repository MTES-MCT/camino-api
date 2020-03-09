import { IEtapeType, ISection } from '../../../types'
import { dupRemove } from '../../../tools/index'
import { titreSectionsFormat } from './titres-sections'

const etapesTypesFormat = (et: IEtapeType) => {
  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (et.sectionsSpecifiques) {
    et.sections = et.sections
      ? (dupRemove('id', et.sectionsSpecifiques, et.sections) as ISection[])
      : et.sectionsSpecifiques
  }

  if (et.sections) {
    et.sections = titreSectionsFormat(et.sections)
  }

  return et
}

export { etapesTypesFormat }
