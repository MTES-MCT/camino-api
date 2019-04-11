import { titreGet } from '../database/queries/titres'
import { titreEtapeGet } from '../database/queries/titres-etapes'
import { titreDemarcheGet } from '../database/queries/titres-demarches'
import titreEtapeTypeAndStatusCheck from './utils/titre-etape-type-and-status-check'
import titreEtapeDateCheck from './utils/titre-etape-date-check'

const titreEtapeValidation = async titreEtapeNew => {
  const { id: titreEtapeId } = titreEtapeNew

  const titreEtapeOld = await titreEtapeGet(titreEtapeId)
  const titreDemarche = await titreDemarcheGet(titreEtapeOld.titreDemarcheId)
  const titre = await titreGet(titreDemarche.titreId)

  // 1. le type d'étape correspond à la démarche et au type de titre

  const error = titreEtapeTypeAndStatusCheck(
    titreEtapeNew,
    titreDemarche,
    titre
  )
  if (error) {
    return error
  }

  // 2. la date de l'étape est possible en fonction de l'ordre des types d'étapes

  if (titreEtapeNew.date) {
    const error = titreEtapeDateCheck(titreEtapeNew, titreDemarche, titre)
    if (error) {
      return error
    }
  }

  return null
}

export default titreEtapeValidation
