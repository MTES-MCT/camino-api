import {
  entrepriseGet,
  entreprisesGet
} from '../../database/queries/entreprises'

import permissionsCheck from './_permissions-check'

import eagerBuild from './_eager'

const entreprise = async ({ id }, context, info) => {
  if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
    return entrepriseGet(id, { eager: eagerBuild(info) })
  }

  return null
}

const entreprises = async ({ noms }, context, info) => {
  if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
    return entreprisesGet({ noms }, { eager: eagerBuild(info) })
  }

  return []
}

export { entreprise, entreprises }
