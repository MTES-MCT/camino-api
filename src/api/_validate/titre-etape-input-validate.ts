import { ITitreEtape, ITitreDemarche } from '../../types'

import propsDatesCheck from './utils/props-dates-check'
import contenuDatesCheck from './utils/contenu-dates-check'
import propsNumbersCheck from './utils/props-numbers-check'
import contenuNumbersCheck from './utils/contenu-numbers-check'

const numberProps = (['duree', 'surface'] as unknown) as [keyof ITitreEtape]

const dateProps = (['date', 'dateDebut', 'dateFin'] as unknown) as [
  keyof ITitreEtape
]

const titreEtapeInputValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche
) => {
  const errors = []

  const etapeType = titreDemarche.type?.etapesTypes.find(
    et => et.id === titreEtape.typeId
  )

  if (etapeType) {
    // 1. les champs number ne peuvent avoir une durée négative
    const errorsNumbers = propsNumbersCheck(numberProps, titreEtape)
    if (errorsNumbers) {
      errors.push(errorsNumbers)
    }

    if (titreEtape.contenu && etapeType.sections) {
      const errorsContenu = contenuNumbersCheck(
        etapeType.sections,
        titreEtape.contenu
      )
      if (errorsContenu) {
        errors.push(errorsContenu)
      }
    }

    // 2. les champs date ne peuvent avoir une date invalide
    const errorsDates = propsDatesCheck<ITitreEtape>(dateProps, titreEtape)
    if (errorsDates) {
      errors.push(errorsDates)
    }

    // 3. les champs date des sections ne peuvent avoir une date invalide
    if (titreEtape.contenu && etapeType.sections) {
      const errorsContenu = contenuDatesCheck(
        etapeType.sections,
        titreEtape.contenu
      )
      if (errorsContenu) {
        errors.push(errorsContenu)
      }
    }
  }

  return errors
}

export { titreEtapeInputValidate }
