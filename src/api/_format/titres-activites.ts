import {
  ITitreActivite,
  ITrimestre,
  IMois,
  IAnnee,
  IFields,
  ISection,
  IContenu
} from '../../types'

import { titreSectionsFormat } from './titres-sections'

const titreActiviteContenuFormat = (
  sections: ISection[],
  contenu: IContenu,
  operation: 'read' | 'write'
) => {
  const section = sections.find(s => s.id === 'substancesFiscales')

  if (section?.elements?.length && contenu?.substancesFiscales) {
    const substancesFiscalesIds = Object.keys(contenu?.substancesFiscales)

    substancesFiscalesIds.forEach(id => {
      const element = section!.elements!.find(e => e.id === id)
      const ratio = element?.referenceUniteRatio

      if (ratio) {
        contenu!.substancesFiscales[id] =
          operation === 'read'
            ? (contenu!.substancesFiscales[id] as number) / ratio
            : (contenu!.substancesFiscales[id] as number) * ratio
      }
    })
  }

  return contenu
}

const titreActiviteFormatFields = {
  periode: {},
  sections: {}
} as IFields

const titreActiviteFormat = (
  ta: ITitreActivite,
  fields: IFields = titreActiviteFormatFields
) => {
  // si les sections contiennent des élements sur cette activité
  if (fields.sections && ta.sections?.length) {
    ta.sections = titreSectionsFormat(ta.sections)
  }

  if (ta.contenu) {
    ta.contenu = titreActiviteContenuFormat(ta.sections, ta.contenu, 'read')
  }

  // si
  // - le formatage de la période est requis par les fields
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
  }

  return ta
}

export {
  titreActiviteFormatFields,
  titreActiviteFormat,
  titreActiviteContenuFormat
}
