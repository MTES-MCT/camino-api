import { IToken, ITravauxTypeTravauxEtapeType } from '../../../types'

import { debug } from '../../../config/index'

import { userGet } from '../../../database/queries/utilisateurs'

import { permissionCheck } from '../../../tools/permission'

import {
  travauxTypesTravauxEtapesTypesGet,
  travauxTypeTravauxEtapeTypeUpdate,
  travauxTypeTravauxEtapeTypeCreate,
  travauxTypeTravauxEtapeTypeDelete
} from '../../../database/queries/metas-travaux'

//

const travauxTypesTravauxEtapesTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxTypesTravauxEtapesTypes = await travauxTypesTravauxEtapesTypesGet()

    return travauxTypesTravauxEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeTravauxEtapeTypeModifier = async (
  {
    travauxTypeTravauxEtapeType
  }: { travauxTypeTravauxEtapeType: ITravauxTypeTravauxEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxTypeTravauxEtapeTypeUpdate(
      travauxTypeTravauxEtapeType.travauxTypeId,
      travauxTypeTravauxEtapeType.travauxEtapeTypeId,
      travauxTypeTravauxEtapeType
    )

    const travauxTypesTravauxEtapesTypes = await travauxTypesTravauxEtapesTypesGet()

    return travauxTypesTravauxEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeTravauxEtapeTypeCreer = async (
  {
    travauxTypeTravauxEtapeType
  }: { travauxTypeTravauxEtapeType: ITravauxTypeTravauxEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxTypeTravauxEtapeTypeCreate(travauxTypeTravauxEtapeType)

    const travauxTypesTravauxEtapesTypes = await travauxTypesTravauxEtapesTypesGet()

    return travauxTypesTravauxEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeTravauxEtapeTypeSupprimer = async (
  {
    travauxTypeTravauxEtapeType
  }: { travauxTypeTravauxEtapeType: ITravauxTypeTravauxEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxTypeTravauxEtapeTypeDelete(
      travauxTypeTravauxEtapeType.travauxTypeId,
      travauxTypeTravauxEtapeType.travauxEtapeTypeId
    )

    const travauxTypesTravauxEtapesTypes = await travauxTypesTravauxEtapesTypesGet()

    return travauxTypesTravauxEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  travauxTypesTravauxEtapesTypes,
  travauxTypeTravauxEtapeTypeModifier,
  travauxTypeTravauxEtapeTypeCreer,
  travauxTypeTravauxEtapeTypeSupprimer
}
