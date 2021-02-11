import { ITitreActivite } from '../../types'

const titreActiviteDeletionValidate = (titreActivite: ITitreActivite) => {
  const errors = [] as string[]

  if (!titreActivite.suppression) {
    errors.push(`impossible de supprimer cette activité`)
  }

  return errors
}

export { titreActiviteDeletionValidate }
