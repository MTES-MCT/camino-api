import {
  entrepriseGet,
  entreprisesGet
} from '../../database/queries/entreprises'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import { titresRestrict } from './_titre'
import { utilisateursRestrict } from './_utilisateur'

const entrepriseRestrict = (entreprise, user) => {
  entreprise.titresTitulaire = titresRestrict(entreprise.titresTitulaire, user)
  entreprise.titresAmodiataire = titresRestrict(
    entreprise.titresAmodiataire,
    user
  )
  entreprise.utilisateurs = utilisateursRestrict(entreprise.utilisateurs, user)

  return entreprise
}

const entreprisesRestrict = (entreprises, user) =>
  entreprises.map(entreprise => entrepriseRestrict(entreprise, user))

const entreprise = async ({ id }, context, info) => {
  const fields = fieldsBuild(info)

  const entreprise = await entrepriseGet(id, {
    eager: eagerBuild(fields, { format: titreEagerFormat, root: 'entreprise' })
  })

  const user = context.user && (await utilisateurGet(context.user.id))

  return entrepriseRestrict(entreprise, user)
}

const entreprises = async ({ noms }, context, info) => {
  const fields = fieldsBuild(info)
  const entreprises = await entreprisesGet(
    { noms },
    {
      eager: eagerBuild(fields, {
        format: titreEagerFormat,
        root: 'entreprise'
      })
    }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  return entreprisesRestrict(entreprises, user)
}

export { entreprise, entreprises }
