import {
  entrepriseEtablissementFormat,
  entrepriseAdresseFormat
} from './format'

import { inseeTypeFetchBatch, tokenInitialize } from './fetch'

// cherche les établissements des entreprises
// retourne des objets du modèle EntrepriseEtablissements
const entreprisesEtablissementsGet = async sirenIds => {
  if (!sirenIds.length) return []

  const entreprisesEtablissements = await inseeTypeFetchBatch(
    'siren',
    'unitesLegales',
    sirenIds,
    idsBatch => idsBatch.map(s => `siren:${s}`).join(' OR ')
  )

  if (!entreprisesEtablissements || !Array.isArray(entreprisesEtablissements)) {
    return null
  }

  return entreprisesEtablissements.reduce((acc, e) => {
    if (e) {
      acc.push(...entrepriseEtablissementFormat(e))
    }

    return acc
  }, [])
}

// cherche les adresses des entreprises
// retourne des objets du modèle Entreprise
const entreprisesGet = async sirenIds => {
  const etablissements = await inseeTypeFetchBatch(
    'siret',
    'etablissements',
    sirenIds,
    idsBatch => {
      const ids = idsBatch.map(s => `siren:${s}`).join(' OR ')

      return `(${ids}) AND etablissementSiege:true`
    }
  )

  if (!etablissements || !Array.isArray(etablissements)) {
    return null
  }

  return etablissements.reduce((acc, e) => {
    if (e) {
      acc.push(entrepriseAdresseFormat(e))
    }

    return acc
  }, [])
}

const entrepriseGet = async sirenId => {
  const entreprises = await entreprisesGet([sirenId])
  if (!entreprises) {
    throw new Error('erreur API Insee')
  }

  const entreprisesEtablissement = await entreprisesEtablissementsGet([sirenId])

  const [entreprise] = entreprises
  entreprise.etablissements = entreprisesEtablissement

  return entreprise
}

export {
  tokenInitialize,
  entrepriseGet,
  entreprisesGet,
  entreprisesEtablissementsGet
}
