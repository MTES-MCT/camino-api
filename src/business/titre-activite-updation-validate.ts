import { IContenu, ISection } from '../types'

import titreActiviteNumbersCheck from './utils/titre-activite-numbers-check'

const titreActiviteUpdationValidate = (
  titreActiviteContenu: IContenu | undefined | null,
  activiteTypeSections: ISection[] | undefined | null
) => {
  const errors = []

  if (activiteTypeSections) {
    if (titreActiviteContenu) {
      // les champs number ne peuvent avoir une durée négative
      const errorNumbers = titreActiviteNumbersCheck(
        titreActiviteContenu,
        activiteTypeSections
      )

      if (errorNumbers) {
        errors.push(errorNumbers)
      }
    }
  } else {
    errors.push('sections manquantes pour cette activité')
  }

  return errors
}

export default titreActiviteUpdationValidate
