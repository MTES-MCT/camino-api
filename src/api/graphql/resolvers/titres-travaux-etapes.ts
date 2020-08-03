import { IToken, ITitreTravauxEtape } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../../config/index'
import { permissionCheck } from '../../../tools/permission'
import fieldsBuild from './_fields-build'

import { titreTravauxGet } from '../../../database/queries/titres-travaux'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreGet } from '../../../database/queries/titres'

import { titreFormat } from '../../_format/titres'
import {
  titreTravauxEtapeUpsert,
  titreTravauxEtapeGet,
  titreTravauxEtapeDelete
} from '../../../database/queries/titres-travaux-etapes'

import titreTravauxEtapeUpdateTask from '../../../business/titre-travaux-etape-update'

import { fichiersDelete } from './_titre-document'

const travauxEtapeCreer = async (
  { etape }: { etape: ITitreTravauxEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travaux = await titreTravauxGet(etape.titreTravauxId, {})

    if (!travaux) throw new Error("les travaux n'existent pas")

    const titre = await titreGet(
      travaux.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )

    if (!titre) throw new Error("le titre n'existe pas")

    const travauxEtapeUpdated = await titreTravauxEtapeUpsert(etape)

    const titreUpdatedId = await titreTravauxEtapeUpdateTask(
      travauxEtapeUpdated.titreTravauxId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeModifier = async (
  { etape }: { etape: ITitreTravauxEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travaux = await titreTravauxGet(etape.titreTravauxId, {})
    if (!travaux) throw new Error("les travaux n'existent pas")

    const titre = await titreGet(
      travaux.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )
    if (!titre) throw new Error("le titre n'existe pas")

    const travauxEtapeUpdated = await titreTravauxEtapeUpsert(etape)

    const titreUpdatedId = await titreTravauxEtapeUpdateTask(
      travauxEtapeUpdated.titreTravauxId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeOld = await titreTravauxEtapeGet(id, {
      fields: { documents: { type: { id: {} } } }
    })
    if (!etapeOld) throw new Error("l'étape de travaux n'existe pas")

    await titreTravauxEtapeDelete(id)

    await fichiersDelete(etapeOld.documents)

    const titreUpdatedId = await titreTravauxEtapeUpdateTask(
      etapeOld.titreTravauxId
    )

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { travauxEtapeCreer, travauxEtapeModifier, travauxEtapeSupprimer }
