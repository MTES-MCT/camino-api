import { IContenu, ISection } from '../../../types'

const contenuNumbersCheck = (sections: ISection[], contenu: IContenu) => {
  const errors = sections.reduce((errors: string[], section) => {
    if (!section.elements) return errors

    return section.elements.reduce((errors, element) => {
      if (
        element.type === 'number' &&
        contenu[section.id] &&
        contenu[section.id][element.id] &&
        contenu[section.id][element.id] < 0
      ) {
        errors.push(
          `le champ "${element.id}" ne peut pas avoir une valeur négative`
        )
      }

      return errors
    }, errors)
  }, [])

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export { contenuNumbersCheck }
