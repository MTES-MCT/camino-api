import {
  entrepriseUpdate,
  entrepriseEtablissementUpdate
} from '../queries/entreprises'
import {
  tokenInitialize,
  entrepriseEtablissementGet,
  entrepriseAdresseGet
} from '../../tools/api-insee'

const entreprisesUpdate = async (entreprises, entreprisesEtablissements) => {
  const sirensIndex = entreprises.reduce((acc, e) => {
    if (!e || !e.legalSiren) return acc

    acc[e.legalSiren] = (acc[e.legalSiren] | 0) + 1

    // prévient s'il y a des doublons dans les sirens
    if (acc[e.legalSiren] > 1) {
      console.info(`SIREN en doublon: ${e.legalSiren}`)
    }
    return acc
  }, {})

  const sirens = Object.keys(sirensIndex)

  if (!sirens.length) {
    return [
      'Mise à jour: 0 entreprises.',
      "Mise à jour: 0 établissements d'entreprises."
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
      "Erreur: impossible de se connecter à l'API INSEE SIREN V3",
      'Mise à jour: 0 entreprises.',
      "Mise à jour: 0 établissements d'entreprises."
    ]
  }

  const entreprisesAdresses = await entrepriseAdresseGet(sirens)
  const entreprisesEtablissementsNew = await entrepriseEtablissementGet(sirens)

  const etablissementsUpdateQueries = entreprisesEtablissementsNew.reduce(
    (acc, entrepriseEtablissementNew) => {
      const entrepriseEtablissementOld = entreprisesEtablissements.find(
        a => a.id === entrepriseEtablissementNew.id
      )

      const entrepriseEtablissementUpdated = entrepriseEtablissementUpdate(
        entrepriseEtablissementNew,
        entrepriseEtablissementOld
      )

      return entrepriseEtablissementUpdated
        ? [...acc, entrepriseEtablissementUpdated]
        : acc
    },
    []
  )

  const adressesUpdateQueries = entreprisesAdresses.reduce(
    (acc, entrepriseNew) => {
      const entrepriseOld = entreprises.find(a => a.id === entrepriseNew.id)

      const entrepriseUpdated = entrepriseUpdate(entrepriseNew, entrepriseOld)

      return entrepriseUpdated ? [...acc, entrepriseUpdated] : acc
    },
    []
  )

  await Promise.all([...adressesUpdateQueries, ...etablissementsUpdateQueries])

  return [
    `Mise à jour: ${etablissementsUpdateQueries.length} etablissements d'entreprises.`,
    `Mise à jour: ${adressesUpdateQueries.length} adresses d'entreprises.`
  ]
}

export default entreprisesUpdate
