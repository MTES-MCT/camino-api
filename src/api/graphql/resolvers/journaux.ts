import { journauxGet } from '../../../database/queries/journaux'
import { userGet } from '../../../database/queries/utilisateurs'
import { debug } from '../../../config'
import { IToken } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { fieldsBuild } from './_fields-build'

export interface IJournauxQueryParams {
  page: number
  intervalle: number
  recherche: string
  titreId: string
}

export const journaux = async (
  params: IJournauxQueryParams,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const { results, total } = await journauxGet(
      params,
      { fields: fields.elements },
      user
    )

    if (!results.length) return { elements: [], total: 0 }

    return {
      elements: results,
      page: params.page,
      intervalle: params.intervalle,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}
