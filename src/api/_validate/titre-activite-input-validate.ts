import { ITitreActivite, ISection } from '../../types'

import contenuNumbersCheck from './utils/contenu-numbers-check'
import propsDatesCheck from './utils/props-dates-check'
import contenuDatesCheck from './utils/contenu-dates-check'

const datePropsNames = ['date'] as [keyof ITitreActivite]

const titreActiviteInputValidate = (
  titreActivite: ITitreActivite,
  activiteTypeSections?: ISection[] | null
) => {
  const errors = []

  // 2. les sections sont présentes
  if (!activiteTypeSections) {
    errors.push('sections manquantes pour cette activité')
  }

  // 1. le format des dates est correct
  const errorsDates = propsDatesCheck(datePropsNames, titreActivite)
  if (errorsDates) {
    errors.push(errorsDates)
  }

  if (titreActivite.contenu && activiteTypeSections) {
    const errorsSections = contenuDatesCheck(
      activiteTypeSections,
      titreActivite.contenu
    )
    if (errorsSections) {
      errors.push(errorsSections)
    }
  }

  // 3. les champs number n'ont pas de durée négative
  if (titreActivite.contenu && activiteTypeSections) {
    const errorsContenu = contenuNumbersCheck(
      activiteTypeSections,
      titreActivite.contenu
    )
    if (errorsContenu) {
      errors.push(errorsContenu)
    }
  }

  return errors
}

export default titreActiviteInputValidate
