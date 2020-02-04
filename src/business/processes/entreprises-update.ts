import { IEntreprisesEtablissements, IEntreprises } from '../../types'

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
  entreprisesEtablissementsOld: IEntreprisesEtablissements[],
  entreprisesEtablissementsNew: IEntreprisesEtablissements[]
) =>
  entreprisesEtablissementsNew.reduce(
    (acc: IEntreprisesEtablissements[], entrepriseEtablissementNew) => {
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
    },
    []
  )

const entreprisesEtablissementsToDeleteBuild = (
  entreprisesEtablissementsOld: IEntreprisesEtablissements[],
  entreprisesEtablissementsNew: IEntreprisesEtablissements[]
) =>
  entreprisesEtablissementsOld.reduce(
    (acc: string[], entrepriseEtablissementOld) => {
      const deleted = !entreprisesEtablissementsNew.find(
        a => a && a.id === entrepriseEtablissementOld.id
      )

      if (deleted) {
        acc.push(entrepriseEtablissementOld.id)
      }

      return acc
    },
    []
  )

const entreprisesToUpdateBuild = (
  entreprisesOld: IEntreprises[],
  entreprisesNew: IEntreprises[]
) =>
  entreprisesNew.reduce((acc: IEntreprises[], entrepriseNew) => {
    const entrepriseOld = entreprisesOld.find(e => e.id === entrepriseNew.id)

    const updated =
      !entrepriseOld || objectsDiffer(entrepriseNew, entrepriseOld)

    if (updated) {
      acc.push(entrepriseNew)
    }

    return acc
  }, [])

const sirensFind = (entreprisesOld: IEntreprises[]) =>
  Object.keys(
    entreprisesOld.reduce((acc: { [id: string]: number }, entrepriseOld) => {
      if (!entrepriseOld.legalSiren) return acc

      let siren = Number(acc[entrepriseOld.legalSiren])
      siren = isNaN(siren) ? 0 : siren
      siren += 1

      acc[entrepriseOld.legalSiren] = siren

      // prévient s'il y a des doublons dans les sirens
      if (acc[entrepriseOld.legalSiren] > 1) {
        console.info(`SIREN en doublon: ${entrepriseOld.legalSiren}`)
      }

      return acc
    }, {})
  )

const entreprisesUpdate = async (
  entreprisesOld: IEntreprises[],
  entreprisesEtablissementsOld: IEntreprisesEtablissements[]
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

  let etablissementsUpdated = [] as IEntreprisesEtablissements[]

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

  let entreprisesUpdated = [] as IEntreprises[]

  if (entreprisesToUpdate.length) {
    entreprisesUpdated = await entreprisesUpsert(entreprisesToUpdate)
    console.log(
      `mise à jour: entreprise ${entreprisesUpdated.map(e => e.id).join(', ')}`
    )
  }

  return [entreprisesUpdated, etablissementsUpdated, etablissementsDeleted]
}

export default entreprisesUpdate
