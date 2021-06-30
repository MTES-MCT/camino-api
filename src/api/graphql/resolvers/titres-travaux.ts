import { GraphQLResolveInfo } from 'graphql'

import { IToken, ITitreTravaux } from '../../../types'

import {
  titresTravauGet,
  titreTravauxCreate,
  titreTravauxUpdate,
  titreTravauxDelete
} from '../../../database/queries/titres-travaux'
import { fieldsBuild } from './_fields-build'
import { titreGet } from '../../../database/queries/titres'
import { debug } from '../../../config/index'
import { titreFormat } from '../../_format/titres'
import titreTravauxUpdateTask from '../../../business/titre-travaux-update'

import { titreEtapesOrActivitesFichiersDelete } from './_titre-document'
import { userGet } from '../../../database/queries/utilisateurs'

const travaux = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = await userGet(context.user?.id)

    const titreTravaux = await titresTravauGet(id, { fields }, user)

    if (!titreTravaux) {
      throw new Error("le travail n'existe pas")
    }

    return titreTravaux
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxCreer = async (
  { travaux }: { travaux: ITitreTravaux },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titre = await titreGet(travaux.titreId, { fields: {} }, user)

    if (!titre) throw new Error("le titre n'existe pas")

    if (!titre.travauxCreation) throw new Error('droits insuffisants')

    const travauxUpdated = await titreTravauxCreate(travaux)

    const titreUpdatedId = await titreTravauxUpdateTask(travauxUpdated.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxModifier = async (
  { travaux }: { travaux: ITitreTravaux },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const oldTitreTravaux = await titresTravauGet(
      travaux.id,
      { fields: {} },
      user
    )

    if (!oldTitreTravaux) throw new Error("Les travaux n'existent pas")

    if (!oldTitreTravaux.modification) throw new Error('droits insuffisants')

    if (travaux.titreId !== oldTitreTravaux.titreId)
      throw new Error("le titre n'existe pas")

    await titreTravauxUpdate(travaux.id, travaux)

    const titreUpdatedId = await titreTravauxUpdateTask(travaux.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const oldTitreTravaux = await titresTravauGet(id, { fields: {} }, user)

    if (!oldTitreTravaux) throw new Error("Les travaux n'existent pas")

    if (!oldTitreTravaux.suppression) throw new Error('droits insuffisants')

    const travauxOld = await titresTravauGet(
      id,
      { fields: { travauxEtapes: { id: {} } } },
      user
    )

    if (!travauxOld) throw new Error("la démarche n'existe pas")

    await titreTravauxDelete(id)

    await titreEtapesOrActivitesFichiersDelete(
      'travaux',
      travauxOld.travauxEtapes
    )

    const titreUpdatedId = await titreTravauxUpdateTask(travauxOld.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { travauxCreer, travauxModifier, travauxSupprimer, travaux }
