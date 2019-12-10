import errorLog from '../../tools/error-log'
import { entrepriseEtablissementsFormat, entrepriseFormat } from './format'
import { typeBatchFetch, tokenInitialize } from './fetch'

// cherche les établissements des entreprises
// retourne des objets du modèle EntrepriseEtablissements
const entreprisesEtablissementsGet = async sirenIds => {
  if (!sirenIds.length) return []

  const token = await tokenInitialize()

  if (!token) {
    errorLog('API Insee: impossible de se connecter')

    return []
  }

  const entreprisesEtablissements = await typeBatchFetch(
    'siren',
    'unitesLegales',
    sirenIds,
    idsBatch => idsBatch.map(s => `siren:${s}`).join(' OR ')
  )

  if (!entreprisesEtablissements || !Array.isArray(entreprisesEtablissements)) {
    return []
  }

  return entreprisesEtablissements.reduce((acc, e) => {
    if (e) {
      acc.push(...entrepriseEtablissementsFormat(e))
    }

    return acc
  }, [])
}

// cherche les adresses des entreprises
// retourne des objets du modèle Entreprise
const entreprisesGet = async sirenIds => {
  const token = await tokenInitialize()

  if (!token) {
    errorLog('API Insee: impossible de se connecter')

    return []
  }

  const entreprises = await typeBatchFetch(
    'siret',
    'etablissements',
    sirenIds,
    idsBatch => {
      const ids = idsBatch.map(s => `siren:${s}`).join(' OR ')

      return `(${ids}) AND etablissementSiege:true`
    }
  )

  if (!entreprises || !Array.isArray(entreprises)) {
    return []
  }

  return entreprises.reduce((acc, e) => {
    if (e) {
      acc.push(entrepriseFormat(e))
    }

    return acc
  }, [])
}

const entrepriseAndEtablissementsGet = async sirenId => {
  const token = await tokenInitialize()

  if (!token) {
    throw new Error('API Insee: impossible de se connecter')
  }

  const entreprises = await entreprisesGet([sirenId])
  if (!entreprises) {
    throw new Error('API Insee: erreur')
  }

  const [entreprise] = entreprises
  if (!entreprise) return null

  entreprise.etablissements = await entreprisesEtablissementsGet([sirenId])

  return entreprise
}

export {
  entrepriseAndEtablissementsGet,
  entreprisesGet,
  entreprisesEtablissementsGet
}
