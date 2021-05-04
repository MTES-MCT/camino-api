import { ISection, ISectionElement } from '../../types'

import { metasGet } from '../../database/cache/metas'
import { objectClone } from '../../tools/index'

const titreSectionElementFormat = (element: ISectionElement) => {
  if (element.valeursMetasNom) {
    element.valeurs = metasGet(element.valeursMetasNom)

    delete element.valeursMetasNom
  }

  if (['radio', 'checkbox'].includes(element.type)) {
    element.optionnel = false
  }

  return element
}

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = (sections: ISection[]) =>
  sections.reduce((sections: ISection[], { id, nom, elements }) => {
    if (elements?.length) {
      const newElements = objectClone(elements)

      sections.push({
        id,
        nom,
        elements: newElements.map(titreSectionElementFormat)
      })
    }

    return sections
  }, [])

export { titreSectionsFormat }
