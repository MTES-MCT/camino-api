import { IContenu, ISection } from '../../../types'

const contenuNumbersCheck = (sections: ISection[], contenu: IContenu) => {
  const errors = sections.reduce(
    (errors: string[], section) =>
      section.elements
        ? section.elements.reduce((errors, element) => {
            const contenuElement = contenu[section.id][element.id]
            if (
              element.type === 'number' &&
              contenuElement &&
              contenuElement < 0
            ) {
              errors.push(
                `le champ "${element.id}" ne peut pas avoir une valeur négative`
              )
            }

            return errors
          }, errors)
        : errors,
    []
  )

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default contenuNumbersCheck
