import titreActiviteNumbersCheck from './utils/titre-activite-numbers-check'

const titreActiviteUpdationValidate = (
  titreActviteContenu,
  activiteTypeSections
) => {
  const errors = []
  // les champs number ne peuvent avoir une durée négative

  const errorNumbers = titreActiviteNumbersCheck(
    titreActviteContenu,
    activiteTypeSections
  )

  if (errorNumbers) {
    errors.push(errorNumbers)
  }

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreActiviteUpdationValidate
