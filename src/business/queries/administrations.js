import { administrationsUpsert } from '../../database/queries/administrations'

const administrationUpdate = async administrations => {
  await administrationsUpsert(administrations)

  return `Mise à jour: administrations ${administrations
    .map(a => a.id)
    .join(', ')}`
}

export { administrationUpdate }
