import {
  entrepriseGet,
  entreprisesGet
} from '../../database/queries/entreprises'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import { titresFormat } from './_titre-format'
import { utilisateursFormat } from './_utilisateur'

const entrepriseFormat = (entreprise, user) => {
  entreprise.titresTitulaire = titresFormat(entreprise.titresTitulaire, user)
  entreprise.titresAmodiataire = titresFormat(
    entreprise.titresAmodiataire,
    user
  )
  entreprise.utilisateurs = utilisateursFormat(entreprise.utilisateurs, user)

  return entreprise
}

const entreprisesFormat = (entreprises, user) =>
  entreprises.map(entreprise => entrepriseFormat(entreprise, user))

const entreprise = async ({ id }, context, info) => {
  const entreprise = await entrepriseGet(id, {
    eager: eagerBuild(fieldsBuild(info), 'entreprise', titreEagerFormat)
  })

  const user = context.user && (await utilisateurGet(context.user.id))

  return entrepriseFormat(entreprise, user)
}

const entreprises = async ({ noms }, context, info) => {
  const entreprises = await entreprisesGet(
    { noms },
    {
      eager: eagerBuild(fieldsBuild(info), 'entreprise', titreEagerFormat)
    }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  return entreprisesFormat(entreprises, user)
}

export { entreprise, entreprises }
