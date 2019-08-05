import { administrationsUpsert } from '../../database/queries/administrations'
import { organismesDepartementsGet } from '../../tools/api-administrations/index'

import { objectsDiffer } from '../../tools'

const administrationsUpdatedFind = (administrationsOld, administrationsNew) =>
  administrationsNew.reduce((acc, administrationNew) => {
    const administrationOld = administrationsOld.find(
      a => a.id === administrationNew.id
    )

    const updated =
      !administrationOld || objectsDiffer(administrationNew, administrationOld)

    return updated ? [...acc, administrationNew] : acc
  }, [])

const administrationsGet = async departements => {
  const departementsIdsNoms = departements.map(({ id: departementId }) => ({
    departementId,
    nom: departementId === '75' ? 'prefecture_region' : 'prefecture'
  }))

  return organismesDepartementsGet(departementsIdsNoms)
}

const administrationsUpdate = async (administrationsOld, departements) => {
  const administrationsNew = await administrationsGet(departements)

  // TODO: si aucune administration est retournée,
  // effacer les administrations correspondantes dans la base

  const administrationsUpdated = administrationsUpdatedFind(
    administrationsOld,
    administrationsNew
  )

  if (administrationsUpdated.length) {
    await administrationsUpsert(administrationsUpdated)
    console.log(
      `mise à jour: administrations ${administrationsUpdated
        .map(a => a.id)
        .join(', ')}`
    )
  }

  return `mise à jour: ${administrationsUpdated.length} administration(s)`
}

export default administrationsUpdate
