import { IToken, ITitreEtape } from '../../types'

import { debug } from '../../config/index'

import { titreFormat } from './format/titres'

import { permissionCheck } from '../../tools/permission'
import { titreEtapePermissionAdministrationsCheck } from './permissions/titre-edition'

import {
  titreEtapeGet,
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { userGet } from '../../database/queries/utilisateurs'

import { titreEtapeDocumentsDelete } from './_titre-document'

import titreEtapeUpdateTask from '../../business/titre-etape-update'
import titreEtapePointsCalc from '../../business/titre-etape-points-calc'
import titreEtapeUpdationValidate from '../../business/titre-etape-updation-validate'

import { GraphQLResolveInfo } from 'graphql'
import fieldsBuild from './_fields-build'

const etapeCreer = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const demarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {},
      user && user.id
    )

    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      demarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )

    if (!titre) throw new Error("le titre n'existe pas")

    if (
      !titreEtapePermissionAdministrationsCheck(
        user,
        titre.typeId,
        titre.statutId!,
        etape.typeId,
        'creation'
      )
    ) {
      throw new Error('droits insuffisants pour créer cette étape')
    }

    const rulesErrors = await titreEtapeUpdationValidate(etape, demarche, titre)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdatedId = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
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

const etapeModifier = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const demarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {},
      user && user.id
    )

    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      demarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )
    if (!titre) throw new Error("le titre n'existe pas")

    if (
      !titreEtapePermissionAdministrationsCheck(
        user,
        titre.typeId,
        titre.statutId!,
        etape.typeId,
        'modification'
      )
    ) {
      throw new Error('droits insuffisants pour modifier cette étape')
    }

    const rulesErrors = await titreEtapeUpdationValidate(etape, demarche, titre)
    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdatedId = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
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

const etapeSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeOld = await titreEtapeGet(id, {}, context.user?.id)
    if (!etapeOld) throw new Error("l'étape n'existe pas")

    await titreEtapeDelete(id)

    await titreEtapeDocumentsDelete(etapeOld)

    const titreUpdatedId = await titreEtapeUpdateTask(
      null,
      etapeOld.titreDemarcheId
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

export { etapeCreer, etapeModifier, etapeSupprimer }
