import { GraphQLResolveInfo } from 'graphql'
import { IToken, ITravauxEtapeType, ITravauxType } from '../../../types'
import { debug } from '../../../config/index'

import {
  travauxEtapesTypesGet,
  travauxTypesGet,
  travauxTypeUpdate,
  travauxEtapeTypeUpdate
} from '../../../database/queries/metas-travaux'

import { userGet } from '../../../database/queries/utilisateurs'

import { permissionCheck } from '../../../tools/permission'
import { fieldsBuild } from './_fields-build'
import { ordreUpdate } from './_ordre-update'

const travauxTypes = async (
  _: never,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const travauxTypes = await travauxTypesGet({ fields }, user)

    return travauxTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeModifier = async (
  { travauxType }: { travauxType: ITravauxType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (travauxType.ordre) {
      const travauxTypes = await travauxTypesGet({ fields }, user)

      await ordreUpdate(travauxType, travauxTypes, travauxTypeUpdate)
    }

    await travauxTypeUpdate(travauxType.id!, travauxType)

    const travauxTypes = await travauxTypesGet({ fields }, user)

    return travauxTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapesTypes = async (
  {
    titreTravauxId
  }: {
    titreTravauxId?: string
    date?: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const etapesTypes = await travauxEtapesTypesGet(
      { titreTravauxId },
      { fields },
      user
    )

    return etapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeModifier = async (
  { travauxEtapeType }: { travauxEtapeType: ITravauxEtapeType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (travauxEtapeType.ordre) {
      const travauxEtapesTypes = await travauxEtapesTypesGet(
        {},
        { fields },
        user
      )

      await ordreUpdate(
        travauxEtapeType,
        travauxEtapesTypes,
        travauxEtapeTypeUpdate
      )
    }

    await travauxEtapeTypeUpdate(travauxEtapeType.id!, travauxEtapeType)

    const travauxEtapesTypes = await travauxEtapesTypesGet({}, { fields }, user)

    return travauxEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  travauxTypes,
  travauxTypeModifier,
  travauxEtapesTypes,
  travauxEtapeTypeModifier
}
