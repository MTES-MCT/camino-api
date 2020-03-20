import { ITitreEtape, ITitreDemarche, ITitre } from '../types'
import titreEtapeTypeAndStatusValidate from './utils/titre-etape-type-and-status-validate'
import titreEtapeDateValidate from './utils/titre-etape-date-validate'
import titreEtapePointsValidate from './utils/titre-etape-points-validate'
import titreEtapeNumbersValidate from './utils/titre-etape-numbers-validate'

const titreEtapeUpdationValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) => {
  const errors = []

  // 1. le type d'étape correspond à la démarche et au type de titre

  const error = titreEtapeTypeAndStatusValidate(titreEtape, titreDemarche)
  if (error) {
    errors.push(error)
  }

  // 2. la date de l'étape est possible en fonction de l'ordre des types d'étapes

  if (titreEtape.date) {
    const error = titreEtapeDateValidate(titreEtape, titreDemarche, titre)
    if (error) {
      errors.push(error)
    }
  }

  // 3. les références de points sont bien renseignées

  if (titreEtape.points) {
    const error = titreEtapePointsValidate(titreEtape.points)
    if (error) {
      errors.push(error)
    }
  }

  // 4. les champs number ne peuvent avoir une durée négative
  const etapeType = titreDemarche.type?.etapesTypes.find(
    et => et.id === titreEtape.typeId
  )

  if (etapeType && etapeType.sections) {
    const errorNumbers = titreEtapeNumbersValidate(
      titreEtape,
      etapeType.sections
    )
    if (errorNumbers) {
      errors.push(errorNumbers)
    }
  }

  return errors
}

export default titreEtapeUpdationValidate
