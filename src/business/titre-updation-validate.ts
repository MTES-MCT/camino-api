import { ITitre } from '../types'

const titreUpdationValidate = async (titreNew: ITitre, titreOld: ITitre) => {
  // vérifie
  // - si un titre contient des démarches qui ne sont pas recevables
  const errors = []

  if (
    titreOld &&
    (titreOld.domaineId !== titreNew.domaineId ||
      titreOld.typeId !== titreNew.typeId) &&
    titreOld.activites &&
    titreOld.activites.length > 0
  ) {
    errors.push(
      "impossible de changer le type ou le domaine d'un titre qui contient des activités"
    )
  }

  return errors
}

export default titreUpdationValidate
