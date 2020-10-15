import { IAdministrationColonneId, IToken } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../../config/index'
import {
  administrationGet,
  administrationsGet,
  administrationsCount
} from '../../../database/queries/administrations'
import { userGet } from '../../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'

import { administrationFormat } from '../../_format/administrations'

const administration = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const fields = fieldsBuild(info)

    const administration = await administrationGet(
      id,
      { fields },
      context.user?.id
    )

    return administrationFormat(user, administration)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrations = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    typesIds
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IAdministrationColonneId | null
    noms?: string | null
    typesIds?: string[] | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    const fields = fieldsBuild(info)

    const [administrations, total] = await Promise.all([
      administrationsGet(
        { page, intervalle, ordre, colonne, noms, typesIds },
        { fields: fields.elements },
        context.user?.id
      ),
      administrationsCount(
        { noms, typesIds },
        { fields: fields.elements },
        context.user?.id
      )
    ])

    if (!administrations.length) return { elements: [], total: 0 }

    return {
      elements: administrations.map(a => administrationFormat(user, a)),
      page,
      intervalle,
      ordre,
      colonne,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { administration, administrations }
