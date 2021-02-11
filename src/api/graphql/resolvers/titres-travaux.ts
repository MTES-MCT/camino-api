import { IToken, ITitreTravaux } from '../../../types'
import { userGet } from '../../../database/queries/utilisateurs'
import {
  titreTravauxGet,
  titreTravauxCreate,
  titreTravauxUpdate,
  titreTravauxDelete
} from '../../../database/queries/titres-travaux'
import fieldsBuild from './_fields-build'
import { permissionCheck } from '../../../tools/permission'
import { titreGet } from '../../../database/queries/titres'
import { debug } from '../../../config/index'
import { titreFormat } from '../../_format/titres'
import titreTravauxUpdateTask from '../../../business/titre-travaux-update'

import { GraphQLResolveInfo } from 'graphql'
import { titreEtapesOrActivitesFichiersDelete } from './_titre-document'

const travauxCreer = async (
  { travaux }: { travaux: ITitreTravaux },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxUpdated = await titreTravauxCreate(travaux, {
      fields: { id: {} }
    })

    const titreUpdatedId = await titreTravauxUpdateTask(travauxUpdated.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

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
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titre = await titreGet(
      travaux.titreId,
      { fields: { id: {} } },
      user.id
    )

    if (!titre) throw new Error("le titre n'existe pas")

    const travauxUpdated = await titreTravauxUpdate(travaux.id, travaux, {
      fields: { id: {} }
    })

    const titreUpdatedId = await titreTravauxUpdateTask(travauxUpdated.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

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
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    // TODO: ajouter une validation ?

    const travauxOld = await titreTravauxGet(id, {
      fields: { etapes: { documents: { type: { id: {} } } } }
    })
    if (!travauxOld) throw new Error("la démarche n'existe pas")

    await titreTravauxDelete(id)

    await titreEtapesOrActivitesFichiersDelete(travauxOld.etapes)

    const titreUpdatedId = await titreTravauxUpdateTask(travauxOld.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { travauxCreer, travauxModifier, travauxSupprimer }
