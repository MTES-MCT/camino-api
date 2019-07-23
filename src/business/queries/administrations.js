import { administrationsUpsert as administrationsUpsertQuery } from '../../database/queries/administrations'

const administrationsUpsert = async administrations => {
  await administrationsUpsertQuery(administrations)

  return `Mise à jour: administrations ${administrations
    .map(a => a.id)
    .join(', ')}`
}

export { administrationsUpsert }
