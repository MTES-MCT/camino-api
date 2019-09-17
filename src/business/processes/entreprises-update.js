import { objectsDiffer } from '../../tools'
import { entreprisesUpsert } from '../../database/queries/entreprises'
import { entreprisesEtablissementsUpsert } from '../../database/queries/entreprises-etablissements'
import {
  tokenInitialize,
  entrepriseEtablissementGet,
  entrepriseAdresseGet
} from '../../tools/api-insee'
import errorLog from '../../tools/error-log'

const entreprisesEtablissementsToUpdateFind = (
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

const entreprisesToUpdateFind = (entreprisesOld, entreprisesNew) =>
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
    return [[], []]
  }

  // initialise le token de connexion à l'API INSEE
  // s'il est vide, la connexion a échoué

  const token = await tokenInitialize()

  if (!token) {
    errorLog("impossible de se connecter à l'API INSEE")

    return [[], []]
  }

  const entreprisesNew = await entrepriseAdresseGet(sirens)
  const entreprisesEtablissementsNew = await entrepriseEtablissementGet(sirens)

  const entreprisesToUpdate = entreprisesToUpdateFind(
    entreprisesOld,
    entreprisesNew
  )

  const etablissementsToUpdate = entreprisesEtablissementsToUpdateFind(
    entreprisesEtablissementsOld,
    entreprisesEtablissementsNew
  )

  let etablissementsUpdated = []
  let entreprisesUpdated = []

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

  if (entreprisesToUpdate.length) {
    entreprisesUpdated = await entreprisesUpsert(entreprisesToUpdate)
    console.log(
      `mise à jour: entreprise ${entreprisesUpdated.map(e => e.id).join(', ')}`
    )
  }

  return [entreprisesUpdated, etablissementsUpdated]
}

export default entreprisesEtablissementsEtAdressesUpdate
