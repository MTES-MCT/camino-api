import {
  entrepriseGetBySiren,
  entrepriseCreate
} from '../../database/queries/entreprises'
import { tokenInitialize } from '../../tools/api-insee/index'
import entrepriseGetBySirenApi from '../../business/queries/entrepriseApi'
import errorLog from '../../tools/error-log'

const entrepriseParSirenDatabase = async ({ siren }) => {
  const entreprise = await entrepriseGetBySiren(siren)

  return entreprise
}

const entrepriseParSirenApi = async ({ siren }) => {
  // initialise le token de connexion
  const token = await tokenInitialize()

  if (!token) {
    errorLog("impossible de se connecter à l'API INSEE")
    console.log("impossible de se connecter à l'API INSEE")

    return null
  }

  // cherche l'entreprise par son siren dans l'API INSEE
  const entreprise = entrepriseGetBySirenApi(siren, token)

  return entreprise
}

const entrepriseCreer = async ({ entreprise }) => {
  const entrepriseNew = await entrepriseCreate(entreprise)

  return entrepriseNew
}

export { entrepriseParSirenDatabase, entrepriseParSirenApi, entrepriseCreer }
