import {
  ITitreActivite,
  ITrimestre,
  IMois,
  IAnnee,
  IFields
} from '../../../types'

import { titreSectionsFormat } from './titres-sections'

const titreActiviteFormatFields = {
  periode: {},
  sections: {}
} as IFields

const titreActiviteFormat = (
  ta: ITitreActivite,
  fields: IFields = titreActiviteFormatFields
) => {
  // si
  // - le formatage de la période est requis
  // - l'activité a une périodicité
  // - le type d'activité a une fréquence qui contient un tableau de périodes
  // alors la période de l'activité en cours est définie
  if (
    fields.periode &&
    ta.frequencePeriodeId &&
    ta.type?.frequence?.periodesNom &&
    ta.type.frequence[ta.type.frequence.periodesNom] &&
    ta.type.frequence[ta.type.frequence.periodesNom]!.length
  ) {
    ta.periode = ta.type.frequence[ta.type.frequence.periodesNom]!.find(
      p => p.id === ta.frequencePeriodeId
    ) as IAnnee | ITrimestre | IMois

    // si les sections contiennent des élements sur cette activité
    if (fields.sections && ta.type?.sections) {
      ta.sections = titreSectionsFormat(
        ta.type.sections,
        ta.periode?.id,
        ta.date
      )
    }
  }

  return ta
}

export { titreActiviteFormatFields, titreActiviteFormat }
