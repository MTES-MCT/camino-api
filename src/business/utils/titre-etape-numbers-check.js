const numberProps = ['duree', 'engagement', 'surface', 'volume']

const titreEtapeNumbersCheck = (titreEtape, sections) => {
  const errorsFondamentales = numberProps.reduce((errors, prop) => {
    if (titreEtape[prop] && titreEtape[prop] < 0) {
      errors.push(`le champs "${prop}" ne peut pas avoir une valeur négative`)
    }

    return errors
  }, [])

  // TODO
  // prendre en compte les champs dont le type === 'number'
  // dans les sections

  const errorsContenu = sections
    ? sections.reduce(
        (res, section) =>
          section.elements
            ? section.elements.reduce((res, element) => {
                if (
                  element.type === 'number' &&
                  titreEtape.contenu[section.id] &&
                  titreEtape.contenu[section.id][element.id] &&
                  titreEtape.contenu[section.id][element.id] < 0
                ) {
                  res.push(
                    `le champs "${element.id}" ne peut pas avoir une valeur négative`
                  )
                }

                return res
              }, res)
            : res,
        []
      )
    : []

  const errors = [...errorsFondamentales, ...errorsContenu]

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreEtapeNumbersCheck
