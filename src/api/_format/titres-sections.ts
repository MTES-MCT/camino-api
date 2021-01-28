import { ISection, ISectionElement } from '../../types'

import metas from '../../database/cache/metas'

const titreSectionElementFormat = (e: ISectionElement) => {
  if (e.valeursMetasNom) {
    e.valeurs = metas[e.valeursMetasNom]

    delete e.valeursMetasNom
  }

  return e
}

const titreSectionElementsFormat = (
  elements: ISectionElement[],
  periodeId: number | undefined = undefined,
  date: string | undefined = undefined
) =>
  elements.reduce((elements: ISectionElement[], e) => {
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

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = (
  sections: ISection[],
  periodeId: number | undefined = undefined,
  date: string | undefined = undefined
) =>
  sections.reduce((sections: ISection[], s) => {
    if (s.elements) {
      const elements = titreSectionElementsFormat(s.elements, periodeId, date)

      if (elements?.length) {
        sections.push({
          id: s.id,
          nom: s.nom,
          elements
        })
      }
    }

    return sections
  }, [])

export { titreSectionsFormat }
