import { ISection, IHeritageContenu } from '../../../types'

const heritageContenuValidate = (
  sections?: ISection[] | null,
  heritageContenu?: IHeritageContenu | null
) => {
  const errors = [] as string[]

  if (
    (!heritageContenu || !Object.keys(heritageContenu)?.length) &&
    !sections?.length
  ) {
    return errors
  }

  sections!.forEach(section => {
    const heritageSection = heritageContenu ? heritageContenu[section.id] : null
    if (!heritageSection) {
      errors.push(`la section "${section.id}" n’a pas d’héritage de défini`)
    } else {
      const elements = section.elements ? section.elements : []

      elements.forEach(element => {
        const heritageElement = heritageSection[element.id]
        if (!heritageElement) {
          errors.push(
            `l’élement "${element.id}" de la section "${section.id}" n’a pas d’héritage de défini`
          )
        } else {
          Object.keys(heritageElement).forEach(attribute => {
            if (attribute !== 'actif') {
              errors.push(
                `le champ "${attribute}" de l’élement "${element.id}" de la section "${section.id}" est inconnu`
              )
            } else if (typeof heritageElement.actif !== 'boolean') {
              errors.push(
                `le champ "actif" de l’élement "${element.id}" de la section "${section.id}" doit être un booléen`
              )
            }
          })
        }
      })
    }
  })

  if (heritageContenu) {
    Object.keys(heritageContenu).forEach(sectionId => {
      const section = sections!.find(s => s.id === sectionId)
      if (!section) {
        errors.push(`la section "${sectionId}" est inconnue`)
      } else {
        Object.keys(heritageContenu[sectionId]).forEach(elementId => {
          if (!section.elements?.find(e => e.id === elementId)) {
            errors.push(
              `l’élement "${elementId}" de la section "${sectionId}" est inconnu`
            )
          }
        })
      }
    })
  }

  return errors
}

export { heritageContenuValidate }
