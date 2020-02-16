import { IContenu, ISection } from '../types'

import titreActiviteNumbersCheck from './utils/titre-activite-numbers-check'

const titreActiviteUpdationValidate = (
  titreActviteContenu: IContenu | undefined,
  activiteTypeSections: ISection[] | undefined
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

  return errors
}

export default titreActiviteUpdationValidate
