import { IAdministration } from '../../types'

import {
  administrationsGet,
  administrationsUpsert
} from '../../database/queries/administrations'
import {
  organismeDepartementGet,
  organismesDepartementsGet
} from '../../tools/api-administrations/index'

import { objectsDiffer } from '../../tools/index'
import { userSuper } from '../../database/user-super'

const administrationsUpdatedFind = (
  administrationsOld: IAdministration[],
  administrationsNew: IAdministration[]
) =>
  administrationsNew.reduce((acc: IAdministration[], administrationNew) => {
    const administrationOld = administrationsOld.find(
      a =>
        a.departementId === administrationNew.departementId &&
        a.typeId === administrationNew.typeId
    )

    const updated =
      !administrationOld || objectsDiffer(administrationNew, administrationOld)

    if (updated) {
      acc.push(administrationNew)
    }

    return acc
  }, [])

const apiAdministrationGetTest = async () =>
  organismeDepartementGet(
    '01',
    'prefecture'
  ) as unknown as IAdministration | null

const apiAdministrationsGet = async (departementsIds: string[]) => {
  const departementsIdsNoms = departementsIds.map(departementId => ({
    departementId,
    nom: departementId === '75' ? 'paris_ppp' : 'prefecture'
  }))

  return organismesDepartementsGet(departementsIdsNoms)
}

const administrationsUpdate = async (administrationsIds?: string[]) => {
  console.info()
  console.info('administrations…')
  const apiAdministrationsTest = await apiAdministrationGetTest()
  if (!apiAdministrationsTest) return []

  const administrationsOld = await administrationsGet(
    { administrationsIds },
    {},
    userSuper
  )

  // mise à jour de l'administrations grâce à l'API Administration
  const departementsIds = administrationsOld.reduce((acc, a) => {
    if (a.departementId) {
      acc.push(a.departementId)
    }

    return acc
  }, [] as string[])

  if (!departementsIds.length) return []

  const administrationsNew = await apiAdministrationsGet(departementsIds)

  // si aucune administration n'est retournée,
  // on n'efface pas les administrations correspondantes de la base
  // pour éviter de perdre des données en base

  const administrationsUpdated = administrationsUpdatedFind(
    administrationsOld,
    administrationsNew
  )

  if (administrationsUpdated.length) {
    await administrationsUpsert(administrationsUpdated)

    const log = {
      type: 'administrations (mise à jour) ->',
      value: administrationsUpdated.map(a => a.id).join(', ')
    }

    console.info(log.type, log.value)
  }

  return administrationsUpdated
}

export { administrationsUpdate }
