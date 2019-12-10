import { objectsDiffer } from '../../tools'
import { entreprisesUpsert } from '../../database/queries/entreprises'
import {
  entreprisesEtablissementsUpsert,
  entreprisesEtablissementsDelete
} from '../../database/queries/entreprises-etablissements'
import {
  entreprisesEtablissementsGet,
  entreprisesGet
} from '../../tools/api-insee'

const entreprisesEtablissementsToUpdateBuild = (
  entreprisesEtablissementsOld,
  entreprisesEtablissementsNew
) =>
  entreprisesEtablissementsNew.reduce((acc, entrepriseEtablissementNew) => {
    const entrepriseEtablissementOld = entreprisesEtablissementsOld.find(
      a => a && a.id === entrepriseEtablissementNew.id
    )

    const updated =
      !entrepriseEtablissementOld ||
      objectsDiffer(entrepriseEtablissementNew, entrepriseEtablissementOld)

    if (updated) {
      acc.push(entrepriseEtablissementNew)
    }

    return acc
  }, [])

const entreprisesEtablissementsToDeleteBuild = (
  entreprisesEtablissementsOld,
  entreprisesEtablissementsNew
) =>
  entreprisesEtablissementsOld.reduce((acc, entrepriseEtablissementOld) => {
    const deleted = !entreprisesEtablissementsNew.find(
      a => a && a.id === entrepriseEtablissementOld.id
    )

    if (deleted) {
      acc.push(entrepriseEtablissementOld.id)
    }

    return acc
  }, [])

const entreprisesToUpdateBuild = (entreprisesOld, entreprisesNew) =>
  entreprisesNew.reduce((acc, entrepriseNew) => {
    const entrepriseOld = entreprisesOld.find(
      a => a && a.id === entrepriseNew.id
    )

    const updated =
      !entrepriseOld || objectsDiffer(entrepriseNew, entrepriseOld)

    if (updated) {
      acc.push(entrepriseNew)
    }

    return acc
  }, [])

const sirensFind = entreprisesOld =>
  Object.keys(
    entreprisesOld.reduce((acc, entrepriseOld) => {
      if (!entrepriseOld || !entrepriseOld.legalSiren) return acc

      acc[entrepriseOld.legalSiren] = (acc[entrepriseOld.legalSiren] | 0) + 1

      // prévient s'il y a des doublons dans les sirens
      if (acc[entrepriseOld.legalSiren] > 1) {
        console.info(`SIREN en doublon: ${entrepriseOld.legalSiren}`)
      }

      return acc
    }, {})
  )

const entreprisesEtablissementsEtAdressesUpdate = async (
  entreprisesOld,
  entreprisesEtablissementsOld
) => {
  const sirens = sirensFind(entreprisesOld)

  if (!sirens.length) {
    return [[], [], []]
  }

  const entreprisesNew = await entreprisesGet(sirens)
  const entreprisesEtablissementsNew = await entreprisesEtablissementsGet(
    sirens
  )

  const entreprisesToUpdate = entreprisesToUpdateBuild(
    entreprisesOld,
    entreprisesNew
  )

  const etablissementsToUpdate = entreprisesEtablissementsToUpdateBuild(
    entreprisesEtablissementsOld,
    entreprisesEtablissementsNew
  )

  const etablissementsToDelete = entreprisesEtablissementsToDeleteBuild(
    entreprisesEtablissementsOld,
    entreprisesEtablissementsNew
  )

  let etablissementsUpdated = []

  if (etablissementsToUpdate.length) {
    etablissementsUpdated = await entreprisesEtablissementsUpsert(
      etablissementsToUpdate
    )

    console.log(
      `mise à jour: entreprisesEtablissements ${etablissementsUpdated
        .map(e => e.id)
        .join(', ')}`
    )
  }

  const etablissementsDeleted = etablissementsToDelete

  if (etablissementsToDelete.length) {
    await entreprisesEtablissementsDelete(etablissementsToDelete)

    console.log(
      `suppression: entreprisesEtablissements ${etablissementsToDelete.join(
        ', '
      )}`
    )
  }

  let entreprisesUpdated = []

  if (entreprisesToUpdate.length) {
    entreprisesUpdated = await entreprisesUpsert(entreprisesToUpdate)
    console.log(
      `mise à jour: entreprise ${entreprisesUpdated.map(e => e.id).join(', ')}`
    )
  }

  return [entreprisesUpdated, etablissementsUpdated, etablissementsDeleted]
}

export default entreprisesEtablissementsEtAdressesUpdate
