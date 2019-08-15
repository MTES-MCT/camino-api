import { titreGet } from '../database/queries/titres'
import { titreDemarcheGet } from '../database/queries/titres-demarches'
import titreEtapeTypeAndStatusCheck from './utils/titre-etape-type-and-status-check'
import titreEtapeDateCheck from './utils/titre-etape-date-check'
import titreEtapePointsCheck from './utils/titre-etape-points-check'

const titreEtapeValidation = async titreEtape => {
  const titreDemarche = await titreDemarcheGet(titreEtape.titreDemarcheId)

  const titre = await titreGet(titreDemarche.titreId)

  const errors = []

  // 1. le type d'étape correspond à la démarche et au type de titre

  const error = titreEtapeTypeAndStatusCheck(titreEtape, titreDemarche, titre)

  if (error) {
    errors.push(error)
  }

  // 2. la date de l'étape est possible en fonction de l'ordre des types d'étapes

  if (titreEtape.date) {
    const error = titreEtapeDateCheck(titreEtape, titreDemarche, titre)
    if (error) {
      errors.push(error)
    }
  }

  // 3. les références de points sont bien renseignées

  if (titreEtape.points) {
    const error = titreEtapePointsCheck(titreEtape.points)
    if (error) {
      errors.push(error)
    }
  }

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreEtapeValidation
