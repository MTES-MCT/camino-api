import { communesUpsert as communesUpsertQuery } from '../../database/queries/territoires'

const communesUpsert = async communes => {
  await communesUpsertQuery(communes)

  return `Mise à jour: communes, ${communes
    .map(commune => commune.id)
    .join(', ')}`
}

export { communesUpsert }
