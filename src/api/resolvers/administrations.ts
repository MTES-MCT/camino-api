import { IToken } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'
import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { userGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import graphBuild from '../../database/queries/graph/build'
import graphFormat from '../../database/queries/graph/format'
import {
  administrationFormat,
  administrationsFormat
} from './format/administrations'

const administration = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    const administration = await administrationGet(id, {
      graph: graphBuild(fieldsBuild(info), 'administration', graphFormat)
    })

    return administrationFormat(user, administration)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrations = async (
  { noms }: { noms: string[] },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    const administrations = await administrationsGet(
      { noms },
      {
        graph: graphBuild(fieldsBuild(info), 'administration', graphFormat)
      }
    )

    return administrationsFormat(user, administrations)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { administration, administrations }
