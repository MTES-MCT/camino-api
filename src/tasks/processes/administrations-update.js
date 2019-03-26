import { administrationUpdate } from '../queries/administrations'
import { organismeDepartementGet } from '../../tools/api-administration'

const administrationsUpdate = async (administrations, departements) => {
  const administrationsOrganismes = await departements.reduce(
    async (acc, { id: departementId }) => {
      const administrationTypeId =
        departementId === '75' ? 'prefecture_region' : 'prefecture'

      const organisme = await organismeDepartementGet(
        departementId,
        administrationTypeId
      )

      return [...(await acc), organisme]
    },
    []
  )

  const administrationsUpdateRequests = administrationsOrganismes.reduce(
    (acc, administrationNew) => {
      const administrationOld = administrations.find(
        a => a.id === administrationNew.id
      )

      const administrationUpdated = administrationUpdate(
        administrationNew,
        administrationOld
      )

      return administrationUpdated ? [...acc, administrationUpdated] : acc
    },
    []
  )

  if (administrationsUpdateRequests) {
    const administrationsUpdateQueries = administrationsUpdateRequests.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(administrationsUpdateQueries)
  }

  return [
    `Mise à jour: ${administrationsUpdateRequests.length} administrations.`
  ]
}

export default administrationsUpdate
