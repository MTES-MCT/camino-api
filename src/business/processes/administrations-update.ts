import { IAdministration, IDepartement } from '../../types'

import {
  administrationsGet,
  administrationsUpsert
} from '../../database/queries/administrations'
import { departementsGet } from '../../database/queries/territoires'
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

const apiAdministrationGetTest = async () =>
  (organismeDepartementGet(
    '01',
    'prefecture'
  ) as unknown) as IAdministration | null

const apiAdministrationsGet = async (departements: IDepartement[]) => {
  const departementsIdsNoms = departements.map(({ id: departementId }) => ({
    departementId,
    nom: departementId === '75' ? 'paris_ppp' : 'prefecture'
  }))

  return organismesDepartementsGet(departementsIdsNoms)
}

const administrationsUpdate = async (administrationsIds?: string[]) => {
  // mise à jour de l'administrations grâce à l'API Administration
  const departements = await departementsGet()
  const administrationsOld = await administrationsGet(
    { administrationsIds },
    {},
    'super'
  )

  if (!departements.length) return []

  const apiAdministrationsTest = await apiAdministrationGetTest()
  if (!apiAdministrationsTest) return []

  const administrationsNew = await apiAdministrationsGet(departements)

  // si aucune administration n'est retournée,
  // on n'efface pas les administrations correspondantes de la base
  // pour éviter de perdre des données en base

  const administrationsUpdated = administrationsUpdatedFind(
    administrationsOld,
    administrationsNew
  )

  if (administrationsUpdated.length) {
    await administrationsUpsert(administrationsUpdated)
    console.info(
      `mise à jour: administrations ${administrationsUpdated
        .map(a => a.id)
        .join(', ')}`
    )
  }

  return administrationsUpdated
}

export default administrationsUpdate
