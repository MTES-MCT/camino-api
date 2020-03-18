import { Index, IUtilisateur } from '../../types'
import * as cryptoRandomString from 'crypto-random-string'
import Cerbere = require('./cerbere-nodejs')

const config = {
  cerbereUrl:
    'https://authentification.din.developpement-durable.gouv.fr/cas/public',
  serviceUrl: 'camino.beta.gouv.fr'
}

const CerbereClient = new Cerbere({ url: config.cerbereUrl })

interface ICerbereUtilisateur {
  id?: string
  prenom?: string
  nom?: string
  email?: string
  telephone?: string
  unite?: string
  entrepriseLegalSiren?: string
}

const cerbereUtilisateurProperties = {
  id: 'UTILISATEUR.ID',
  prenom: 'UTILISATEUR.PRENOM',
  nom: 'UTILISATEUR.NOM',
  email: 'UTILISATEUR.MEL',
  telephone: 'UTILISATEUR.TEL_FIXE',
  unite: 'UTILISATEUR.UNITE',
  entrepriseLegalSiren: 'ENTREPRISE.SIREN'
} as ICerbereUtilisateur

const cerbereUtilisateurFormat = (attributes: { [key: string]: string }) =>
  (Object.keys(
    cerbereUtilisateurProperties
  ) as (keyof ICerbereUtilisateur)[]).reduce(
    (cerbereUtilisateur: ICerbereUtilisateur, key) => {
      const profileKey = cerbereUtilisateurProperties[key]!

      const profileValue = attributes[profileKey]

      if (profileValue) {
        cerbereUtilisateur[key] = profileValue
      }

      return cerbereUtilisateur
    },
    {}
  )

const login = async (ticket: string) => {
  try {
    const { extended } = await CerbereClient.validate(ticket, config.serviceUrl)

    return cerbereUtilisateurFormat(extended.attributes)
  } catch (err) {
    err.message = `Cerbère: echec de l'authentification ${err.message}`

    throw err
  }
}

const logout = (returnUrl: string) => CerbereClient.logout(returnUrl, true)

export { login, logout }
