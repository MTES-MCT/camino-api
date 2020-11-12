import errorLog from '../error-log'
import { entrepriseEtablissementsFormat, entrepriseFormat } from './format'
import {
  entreprisesFetch,
  entreprisesEtablissementsFetch,
  tokenInitialize
} from './fetch'
import { IEntreprise, IEntrepriseEtablissement } from '../../types'

// cherche les établissements des entreprises
// retourne des objets du modèle EntrepriseEtablissements
const apiInseeEntreprisesEtablissementsGet = async (sirenIds: string[]) => {
  if (!sirenIds.length) return []

  const token = await tokenInitialize()

  if (!token) {
    errorLog('API Insee: impossible de se connecter')

    return []
  }

  const entreprises = await entreprisesEtablissementsFetch(sirenIds)

  if (!entreprises || !Array.isArray(entreprises)) return []

  return entreprises.reduce((acc: IEntrepriseEtablissement[], e) => {
    if (e) {
      acc.push(...entrepriseEtablissementsFormat(e))
    }

    return acc
  }, [])
}

// cherche les adresses des entreprises
// retourne des objets du modèle Entreprise
const apiInseeEntreprisesGet = async (sirenIds: string[]) => {
  const token = await tokenInitialize()

  if (!token) {
    errorLog('API Insee: impossible de se connecter')

    return []
  }

  const entreprises = await entreprisesFetch(sirenIds)

  if (!entreprises || !Array.isArray(entreprises)) {
    return []
  }

  return entreprises.reduce((acc: IEntreprise[], e) => {
    if (e) {
      acc.push(entrepriseFormat(e))
    }

    return acc
  }, [])
}

const apiInseeEntrepriseAndEtablissementsGet = async (sirenId: string) => {
  const token = await tokenInitialize()

  if (!token) {
    throw new Error('API Insee: impossible de se connecter')
  }

  const entreprises = await apiInseeEntreprisesGet([sirenId])
  if (!entreprises) {
    throw new Error('API Insee: erreur')
  }

  const [entreprise] = entreprises
  if (!entreprise) return null

  entreprise.etablissements = await apiInseeEntreprisesEtablissementsGet([
    sirenId
  ])

  return entreprise
}

export {
  apiInseeEntrepriseAndEtablissementsGet,
  apiInseeEntreprisesGet,
  apiInseeEntreprisesEtablissementsGet
}
