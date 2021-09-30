import { ITitre, IUtilisateur } from '../../types'
import { permissionCheck } from '../../tools/permission'

const titreUpdationValidate = async (
  titreNew: ITitre,
  titreOld: ITitre,
  user: IUtilisateur | null
) => {
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

  // Seuls les utilisateurs super ont le droit de modifier les administrations directement liées sur le titre
  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    const titreAdministrationsIdsOld = titreOld.titresAdministrations
      ? titreOld.titresAdministrations.map(({ id }) => id)
      : []

    const titreAdministrationsIdsNew = titreNew.titresAdministrations
      ? titreNew.titresAdministrations.map(({ id }) => id)
      : []

    let updated =
      titreAdministrationsIdsNew.length !== titreAdministrationsIdsOld.length

    if (!updated) {
      titreAdministrationsIdsOld.sort()
      titreAdministrationsIdsNew.sort()

      updated = titreAdministrationsIdsOld.some(
        (idOld, index) => idOld !== titreAdministrationsIdsNew[index]
      )
    }

    if (updated) {
      errors.push(
        'impossible de modifier les administrations directement liées au titre'
      )
    }
  }

  return errors
}

export { titreUpdationValidate }
