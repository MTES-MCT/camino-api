import titreActiviteNumbersCheck from './utils/titre-activite-numbers-check'

const titreActviteUpdationValidate = titreActvite => {
  const errors = []
  // 4. les champs number ne peuvent avoir une durée négative

  const errorNumbers = titreActiviteNumbersCheck(
    titreActvite.contenu,
    titreActvite.type.sections
  )

  if (errorNumbers) {
    errors.push(errorNumbers)
  }

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreActviteUpdationValidate
