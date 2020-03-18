import { Index, IUtilisateur } from '../../types'
import * as cryptoRandomString from 'crypto-random-string'
import Cerbere = require('./cerbere-nodejs')

const config = {
  cerbereUrl:
    'https://authentification.din.developpement-durable.gouv.fr/cas/public',
  serviceUrl: 'camino.beta.gouv.fr'
}

const CerbereClient = new Cerbere({ url: config.cerbereUrl })

interface ICerbereProfile {
  id?: string
  prenom?: string
  nom?: string
  email?: string
  telephone?: string
  unite?: string
  entrepriseLegalSiren?: string
}

const cerbereProfileProperties = {
  id: 'UTILISATEUR.ID',
  prenom: 'UTILISATEUR.PRENOM',
  nom: 'UTILISATEUR.NOM',
  email: 'UTILISATEUR.MEL',
  telephone: 'UTILISATEUR.TEL_FIXE',
  unite: 'UTILISATEUR.UNITE',
  entrepriseLegalSiren: 'ENTREPRISE.SIREN'
} as ICerbereProfile

const cerbereProfileFormat = (attributes: { [key: string]: string }) =>
  (Object.keys(cerbereProfileProperties) as (keyof ICerbereProfile)[]).reduce(
    (cerbereProfile: ICerbereProfile, key) => {
      const profileKey = cerbereProfileProperties[key]!

      const profileValue = attributes[profileKey]

      if (profileValue) {
        cerbereProfile[key] = profileValue
      }

      return cerbereProfile
    },
    {}
  )

const utilisateurFormat = (attributes: Index<string>) => {
  const cerbereProfile = cerbereProfileFormat(attributes)

  // TODO:
  // consolider l'administration et/ou l'entreprise du profil avec la base
  const utilisateur = ({
    email: cerbereProfile.email,
    prenom: cerbereProfile.prenom,
    nom: cerbereProfile.nom,
    telephone: cerbereProfile.telephone,
    // on génère un mot de passe aléatoire
    motDePasse: cryptoRandomString({ length: 8 })
  } as unknown) as IUtilisateur

  return utilisateur
}

const login = async (ticket: string) => {
  try {
    const { extended } = await CerbereClient.validate(ticket, config.serviceUrl)

    const utilisateur = utilisateurFormat(extended.attributes)

    return utilisateur
  } catch (err) {
    err.message = `Cerbère: echec de l'authentification ${err.message}`

    throw err
  }
}

const logout = (returnUrl: string) => CerbereClient.logout(returnUrl, true)

export { login, logout }
