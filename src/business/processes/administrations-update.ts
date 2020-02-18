import { IAdministration, IDepartement } from '../../types'

import { administrationsUpsert } from '../../database/queries/administrations'
import {
  organismeDepartementGet,
  organismesDepartementsGet
} from '../../tools/api-administrations/index'

import { objectsDiffer } from '../../tools'

const administrationsUpdatedFind = (
  administrationsOld: IAdministration[],
  administrationsNew: IAdministration[]
) =>
  administrationsNew.reduce((acc: IAdministration[], administrationNew) => {
    const administrationOld = administrationsOld.find(
      a => a.id === administrationNew.id
    )

    const updated =
      !administrationOld || objectsDiffer(administrationNew, administrationOld)

    if (updated) {
      acc.push(administrationNew)
    }

    return acc
  }, [])

const administrationsGetTest = async () =>
  (organismeDepartementGet(
    '01',
    'prefecture'
  ) as unknown) as IAdministration | null

const administrationsGet = async (departements: IDepartement[]) => {
  const departementsIdsNoms = departements.map(({ id: departementId }) => ({
    departementId,
    nom: departementId === '75' ? 'paris_ppp' : 'prefecture'
  }))

  return organismesDepartementsGet(departementsIdsNoms)
}

const administrationsUpdate = async (
  administrationsOld: IAdministration[],
  departements: IDepartement[]
) => {
  if (!departements || !departements.length) return []

  const administrationsApiTest = await administrationsGetTest()
  if (!administrationsApiTest) return []

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

  return administrationsUpdated
}

export default administrationsUpdate
