import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdsUpdate } from '../queries/titres'
import { titreActivitesRowUpdate } from '../../tools/export/titre-activites'

const titreIdUpdate = async titreOld => {
  // TODO
  // si l'id du titre change,
  // vérifier dans tous les titres si cet id existe déjà
  // si l'id existe déja, on modifie le nom en ajoutant un chiffre
  const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)
  if (!hasChanged) return titreOld

  const titreIdUpdate = await titreIdsUpdate(titreOld.id, titreNew)

  // met à jour toutes les activités dans la spreadsheet
  if (
    titreOld.id !== titreNew.id &&
    titreNew.activites &&
    titreNew.activites.length
  ) {
    const idGet = titreActiviteId =>
      titreActiviteId.replace(titreNew.id, titreOld.id)
    await titreActivitesRowUpdate(titreNew.activites, idGet)
  }

  console.log(titreIdUpdate)

  return titreNew
}

export default titreIdUpdate
