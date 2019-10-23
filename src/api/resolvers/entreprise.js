import {
  entrepriseGetBySiren,
  entrepriseCreate
} from '../../database/queries/entreprises'
import { tokenInitialize } from '../../tools/api-insee/index'
import entrepriseGetBySirenApi from '../../business/queries/entrepriseApi'
import errorLog from '../../tools/error-log'

const entrepriseParSiren = async ({ siren }) => {
  console.log(siren)
  // cherche si l'entreprise existe en base
  let entreprise = await entrepriseGetBySiren(siren)

  if (entreprise) {
    console.log('existe en base')

    return entreprise
  }

  console.log("n'existe pas en base")
  // si n'existe pas en base -> chercher dans l'API INSEE

  // initialise le token de connexion
  const token = await tokenInitialize()

  if (!token) {
    errorLog("impossible de se connecter à l'API INSEE")
    console.log("impossible de se connecter à l'API INSEE")

    return null
  }

  // todo : à débrancher du resolver
  // cherche l'entreprise par son siren dans l'API INSEE
  entreprise = entrepriseGetBySirenApi(siren, token)

  return entreprise
}

const entrepriseCreer = async ({ entreprise }) => {
  // todo : gérer l'id en amont s'il n'existe pas
  const entrepriseNew = await entrepriseCreate(entreprise)

  return entrepriseNew
}

export { entrepriseParSiren, entrepriseCreer }
