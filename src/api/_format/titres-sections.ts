import { ISection, ISectionElement } from '../../types'

import metas from '../../database/cache/metas'

const titreSectionElementFormat = (e: ISectionElement) => {
  if (e.valeursMetasNom) {
    e.valeurs = metas[e.valeursMetasNom]

    delete e.valeursMetasNom
  }

  return e
}

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = (sections: ISection[]) =>
  sections.reduce((sections: ISection[], s) => {
    if (s.elements) {
      sections.push({
        id: s.id,
        nom: s.nom,
        elements: s.elements.map(titreSectionElementFormat)
      })
    }

    return sections
  }, [])

export { titreSectionsFormat }
