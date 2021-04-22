import { ITitreActivite, ISection } from '../../types'

import { contenuNumbersCheck } from './utils/contenu-numbers-check'
import { propsDatesCheck } from './utils/props-dates-check'
import { contenuDatesCheck } from './utils/contenu-dates-check'

const datePropsNames = ['date'] as [keyof ITitreActivite]

const titreActiviteInputValidate = (
  titreActivite: ITitreActivite,
  activiteSections: ISection[]
) => {
  const errors = []

  // 1. le format des dates est correct
  const errorsDates = propsDatesCheck(datePropsNames, titreActivite)
  if (errorsDates) {
    errors.push(errorsDates)
  }

  if (titreActivite.contenu && activiteSections) {
    const errorsSections = contenuDatesCheck(
      activiteSections,
      titreActivite.contenu
    )
    if (errorsSections) {
      errors.push(errorsSections)
    }
  }

  // 3. les champs number n'ont pas de durée négative
  if (titreActivite.contenu && activiteSections) {
    const errorsContenu = contenuNumbersCheck(
      activiteSections,
      titreActivite.contenu
    )
    if (errorsContenu) {
      errors.push(errorsContenu)
    }
  }

  return errors
}

export { titreActiviteInputValidate }
