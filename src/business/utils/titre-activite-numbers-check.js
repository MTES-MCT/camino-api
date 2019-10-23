const titreActiviteNumbersCheck = (titreActiviteContenu, sections) => {
  const errors = sections.reduce(
    (res, section) =>
      section.elements.reduce((res, element) => {
        if (
          element.type === 'number' &&
          titreActiviteContenu[section.id] &&
          titreActiviteContenu[section.id][element.id] &&
          titreActiviteContenu[section.id][element.id] < 0
        ) {
          res.push(
            `le champs "${element.id}" ne peut pas avoir une valeur négative`
          )
        }

        return res
      }, res),
    []
  )

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreActiviteNumbersCheck
