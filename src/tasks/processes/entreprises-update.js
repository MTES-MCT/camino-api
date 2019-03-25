import { entrepriseUpdate } from '../queries/entreprises'
import {
  tokenInitialize,
  entrepriseHistoriqueGet,
  entrepriseAdresseGet
} from '../../tools/api-insee'

const entreprisesUpdate = async entreprises => {
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
  const token = await tokenInitialize()
  if (!token) {
    return [
      "Erreur: impossible de se connecter à l'API INSEE SIREN V3",
      'Mise à jour: 0 entreprises.',
      "Mise à jour: 0 établissements d'entreprises."
    ]
  }

  const entreprisesAdresses = await entrepriseAdresseGet(sirens)
  const entreprisesHistoriques = await entrepriseHistoriqueGet(sirens)

  const historiquesUpdateQueries = entreprisesHistoriques.reduce(
    (acc, entreprise) =>
      !entreprise || !entreprise.etablissements
        ? acc
        : [...acc, entrepriseUpdate(entreprise)],
    []
  )

  const adressesUpdateQueries = entreprisesAdresses.reduce(
    (acc, etablissement) =>
      !etablissement ? acc : [...acc, entrepriseUpdate(etablissement)],
    []
  )

  await Promise.all([...adressesUpdateQueries, ...historiquesUpdateQueries])

  return [
    `Mise à jour: ${
      historiquesUpdateQueries.length
    } historiques d'entreprises.`,
    `Mise à jour: ${adressesUpdateQueries.length} adresses d'entreprises.`
  ]
}

export default entreprisesUpdate
