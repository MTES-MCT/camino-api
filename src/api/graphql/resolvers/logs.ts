import { logsGet } from '../../../database/queries/logs'
import { userGet } from '../../../database/queries/utilisateurs'
import { debug } from '../../../config'
import { IToken } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { fieldsBuild } from './_fields-build'

export const logs = async (
  {
    page,
    intervalle
  }: {
    page: number
    intervalle: number
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const { results, total } = await logsGet(
      { page, intervalle },
      { fields: fields.elements },
      user
    )

    if (!results.length) return { elements: [], total: 0 }

    return {
      elements: results,
      page,
      intervalle,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}
