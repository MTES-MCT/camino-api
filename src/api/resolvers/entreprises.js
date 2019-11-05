import {
  entrepriseGet,
  entreprisesGet
} from '../../database/queries/entreprises'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import { entrepriseFormat, entreprisesFormat } from './_entreprise'

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
