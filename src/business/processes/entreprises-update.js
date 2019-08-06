import { objectsDiffer } from '../../tools'
import { entreprisesUpsert } from '../../database/queries/entreprises'
import { entreprisesEtablissementsUpsert } from '../../database/queries/entreprises-etablissements'
import {
  tokenInitialize,
  entrepriseEtablissementGet,
  entrepriseAdresseGet
} from '../../tools/api-insee'

const entreprisesEtablissementsUpdatedFind = (
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

const entreprisesUpdatedFind = (entreprisesOld, entreprisesNew) =>
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
    return [
      "mise à jour: 0 établissement(s) d'entreprise(s)",
      "mise à jour: 0 adresse(s) d'entreprise(s)"
    ]
  }

  // initialise le token de connexion à l'API INSEE
  // s'il est vide, la connexion a échoué
  let token
  try {
    token = await tokenInitialize()
  } catch (e) {}

  if (!token) {
    return [
      "erreur: impossible de se connecter à l'API INSEE SIREN V3",
      "mise à jour: 0 établissement(s) d'entreprise(s)",
      "mise à jour: 0 adresse(s) d'entreprise(s)"
    ]
  }

  const entreprisesNew = await entrepriseAdresseGet(sirens)
  const entreprisesEtablissementsNew = await entrepriseEtablissementGet(sirens)

  const entreprisesUpdated = entreprisesUpdatedFind(
    entreprisesOld,
    entreprisesNew
  )

  const etablissementsUpdated = entreprisesEtablissementsUpdatedFind(
    entreprisesEtablissementsOld,
    entreprisesEtablissementsNew
  )

  if (etablissementsUpdated.length) {
    await entreprisesEtablissementsUpsert(etablissementsUpdated)
    console.log(
      `mise à jour: entreprisesEtablissements ${etablissementsUpdated
        .map(e => e.id)
        .join(', ')}`
    )
  }

  if (entreprisesUpdated.length) {
    await entreprisesUpsert(entreprisesUpdated)
    console.log(
      `mise à jour: entreprise ${entreprisesUpdated.map(e => e.id).join(', ')}`
    )
  }

  return [
    `mise à jour: ${etablissementsUpdated.length} établissement(s) d'entreprise(s)`,
    `mise à jour: ${entreprisesUpdated.length} adresse(s) d'entreprise(s)`
  ]
}

export default entreprisesEtablissementsEtAdressesUpdate
