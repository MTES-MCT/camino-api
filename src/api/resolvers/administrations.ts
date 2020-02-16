import { IToken } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'
import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import graphFieldsBuild from './graph/fields-build'
import graphBuild from './graph/build'
import graphFormat from './graph/format'
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
    const user = context.user && (await utilisateurGet(context.user.id))

    const administration = await administrationGet(id, {
      graph: graphBuild(graphFieldsBuild(info), 'administration', graphFormat)
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
    const user = context.user && (await utilisateurGet(context.user.id))

    const administrations = await administrationsGet(
      { noms },
      {
        graph: graphBuild(graphFieldsBuild(info), 'administration', graphFormat)
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
