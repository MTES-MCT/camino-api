import { ITitresActivitesContenu, ISections } from '../types'

import titreActiviteNumbersCheck from './utils/titre-activite-numbers-check'

const titreActiviteUpdationValidate = (
  titreActviteContenu: ITitresActivitesContenu,
  activiteTypeSections: ISections[]
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
