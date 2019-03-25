import { entrepriseUpdate as entrepriseUpdateQuery } from '../../database/queries/entreprises'
import { objectsDiffer } from '../../tools'

const entrepriseUpdate = (entrepriseNew, entrepriseOld) => {
  const updated = !entrepriseOld || objectsDiffer(entrepriseNew, entrepriseOld)

  if (updated) {
    console.log({ entrepriseOld, entrepriseNew, updated })
  }

  return updated
    ? entrepriseUpdateQuery(entrepriseNew).then(
        u => `Mise à jour: entreprise ${entrepriseNew.id}`
      )
    : null
}

export { entrepriseUpdate }
