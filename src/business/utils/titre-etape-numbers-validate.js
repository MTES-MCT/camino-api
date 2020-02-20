const numberProps = ['duree', 'engagement', 'surface', 'volume']

const contenuNumbersValidate = (sections, contenu) => {
  if (!sections || !contenu) return []

  return sections.reduce((res, section) => {
    if (!section.elements) return res

    return section.elements.reduce((res, element) => {
      if (
        element.type === 'number' &&
        contenu[section.id] &&
        contenu[section.id][element.id] &&
        contenu[section.id][element.id] < 0
      ) {
        res.push(
          `le champs "${element.id}" ne peut pas avoir une valeur négative`
        )
      }

      return res
    }, res)
  }, [])
}

const titreEtapeNumbersValidate = (titreEtape, sections) => {
  const errorsFondamentales = numberProps.reduce((errors, prop) => {
    if (titreEtape[prop] && titreEtape[prop] < 0) {
      errors.push(`le champs "${prop}" ne peut pas avoir une valeur négative`)
    }

    return errors
  }, [])

  const errorsContenu = contenuNumbersValidate(sections, titreEtape.contenu)

  const errors = [...errorsFondamentales, ...errorsContenu]

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreEtapeNumbersValidate
