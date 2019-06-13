import {
  entrepriseGet,
  entreprisesGet
} from '../../database/queries/entreprises'

import permissionsCheck from './_permissions-check'

const entreprise = async ({ id }, context, info) => {
  if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
    return entrepriseGet(id)
  }

  return null
}

const entreprises = async ({ noms }, context, info) => {
  if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
    return entreprisesGet({ noms })
  }

  return []
}

export { entreprise, entreprises }
