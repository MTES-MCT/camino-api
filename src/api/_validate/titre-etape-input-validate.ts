import { ITitreEtape, ITitreDemarche, IEtapeType } from '../../types'

import propsDatesCheck from './utils/props-dates-check'
import contenuDatesCheck from './utils/contenu-dates-check'
import propsNumbersCheck from './utils/props-numbers-check'
import contenuNumbersCheck from './utils/contenu-numbers-check'
import { heritageContenuValidate } from './utils/heritage-contenu-validate'
import { etapeTypeSectionsFormat } from '../_format/etapes-types'

const numberProps = (['duree', 'surface'] as unknown) as [keyof ITitreEtape]

const dateProps = (['date', 'dateDebut', 'dateFin'] as unknown) as [
  keyof ITitreEtape
]

const titreEtapeInputValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  etapeType: IEtapeType
) => {
  const errors = []

  const sections = etapeTypeSectionsFormat(
    etapeType,
    titreDemarche.type!.etapesTypes,
    titreDemarche.titre!.typeId
  )

  // le champ heritageContenu est cohérent avec les sections
  const errorsHeritageContenu = heritageContenuValidate(
    sections,
    titreEtape.heritageContenu
  )
  errors.push(...errorsHeritageContenu)

  if (sections.length) {
    // 1. les champs number ne peuvent avoir une durée négative
    const errorsNumbers = propsNumbersCheck(numberProps, titreEtape)
    if (errorsNumbers) {
      errors.push(errorsNumbers)
    }

    if (titreEtape.contenu) {
      const errorsContenu = contenuNumbersCheck(sections, titreEtape.contenu)
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
    if (titreEtape.contenu) {
      const errorsContenu = contenuDatesCheck(sections, titreEtape.contenu)
      if (errorsContenu) {
        errors.push(errorsContenu)
      }
    }
  }

  return errors
}

export { titreEtapeInputValidate }
