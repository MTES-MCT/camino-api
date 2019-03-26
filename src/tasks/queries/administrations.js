import { administrationUpdate as administrationUpdateQuery } from '../../database/queries/administrations'
import { objectsDiffer } from '../../tools'

const administrationUpdate = (administrationNew, administrationOld) => {
  const updated =
    !administrationOld || objectsDiffer(administrationNew, administrationOld)

  return updated
    ? administrationUpdateQuery(administrationNew).then(
        u => `Mise à jour: administration ${administrationNew.id}`
      )
    : null
}

export { administrationUpdate }
