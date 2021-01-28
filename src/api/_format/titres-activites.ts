import {
  ITitreActivite,
  ITrimestre,
  IMois,
  IAnnee,
  IFields,
  ISubstanceFiscale,
  ISection
} from '../../types'

import { objectClone } from '../../tools/object-clone'

import { titreSectionsFormat } from './titres-sections'

const titreActiviteFormatFields = {
  periode: {},
  sections: {}
} as IFields

const titreActiviteFormat = (
  ta: ITitreActivite,
  fields: IFields = titreActiviteFormatFields
) => {
  const sections = objectClone(ta!.type!.sections) as ISection[]

  if (
    ['gra', 'grx'].includes(ta.typeId) &&
    ta.titre?.substances?.length &&
    sections?.length
  ) {
    const substancesFiscales = ta.titre.substances
      .flatMap(sub => sub.legales)
      .flatMap(leg => leg.fiscales)
      .reduce((acc: ISubstanceFiscale[], sub) => {
        if (sub && !acc.map(({ id }) => id).includes(sub.id)) {
          acc.push(sub)
        }

        return acc
      }, [])

    const section = sections.find(({ id }) => id === 'substancesFiscales')

    if (section) {
      section.elements = substancesFiscales.map((sf: ISubstanceFiscale) => ({
        id: sf.id,
        nom: `${sf.nom} (${sf.unite!.nom})`,
        type: 'number',
        description: sf.description
      }))
    }
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

    // si les sections contiennent des élements sur cette activité
    if (fields.sections && sections?.length) {
      ta.sections = titreSectionsFormat(sections, ta.periode?.id, ta.date)
    }
  }

  return ta
}

export { titreActiviteFormatFields, titreActiviteFormat }
