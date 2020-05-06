import { ISection, ISectionElement } from '../../types'

import metas from '../../database/cache/metas'

const titreSectionElementFormat = (e: ISectionElement) => {
  if (e.valeursMetasNom) {
    e.valeurs = metas[e.valeursMetasNom]

    delete e.valeursMetasNom
  }

  return e
}

const titreSectionFormat = (
  s: ISection,
  periodeId: number | undefined = undefined,
  date: string | undefined = undefined
) => {
  const elements =
    s.elements &&
    s.elements.reduce((elements: ISectionElement[], e) => {
      // ne conserve que les éléments dont
      // - la période (si elle existe),
      // - la date de début et la date de fin
      // correspondent à l'élément
      if (
        (!periodeId ||
          !e.frequencePeriodesIds ||
          e.frequencePeriodesIds.find(id => periodeId === id)) &&
        (!date ||
          ((!e.dateFin || e.dateFin >= date) &&
            (!e.dateDebut || e.dateDebut < date)))
      ) {
        e = titreSectionElementFormat(e)

        elements.push(e)
      }

      return elements
    }, [])

  const section = {
    id: s.id,
    nom: s.nom,
    elements
  }

  return section
}

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = (
  sections: ISection[],
  periodeId: number | undefined = undefined,
  date: string | undefined = undefined
) =>
  sections.reduce((sections: ISection[], s) => {
    const section = titreSectionFormat(s, periodeId, date)

    if (section.elements?.length) {
      sections.push(section)
    }

    return sections
  }, [])

export { titreSectionsFormat }
