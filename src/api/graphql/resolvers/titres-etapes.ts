import { IToken, ITitreEtape, ITitreEtapeJustificatif } from '../../../types'

import { debug } from '../../../config/index'

import { titreFormat } from '../../_format/titres'

import { permissionCheck } from '../../../tools/permission'
import { titreEtapePermissionAdministrationsCheck } from '../../_permissions/titre-edition'

import {
  titreEtapeGet,
  titreEtapeUpsert,
  titreEtapeDelete,
  titreEtapeJustificatifsDelete,
  titresEtapesJustificatifsUpsert
} from '../../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreGet } from '../../../database/queries/titres'
import { userGet } from '../../../database/queries/utilisateurs'

import { fichiersDelete } from './_titre-document'

import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import titreEtapePointsCalc from '../../../business/titre-etape-points-calc'
import titreEtapeInputValidate from '../../_validate/titre-etape-input-validate'
import titreEtapeUpdationValidate from '../../../business/titre-etape-updation-validate'
import titreEtapeDeletionValidate from '../../../business/titre-etape-deletion-validate'

import { GraphQLResolveInfo } from 'graphql'
import fieldsBuild from './_fields-build'

// TODO à re-factoriser, c’est un copier/coller de etapeModifier
const etapeCreer = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
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

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titre.id,
      etape.typeId,
      'creation'
    )

    if (!titreEtapePermission) {
      throw new Error('droits insuffisants pour créer cette étape')
    }

    const inputErrors = await titreEtapeInputValidate(etape, demarche)
    if (inputErrors.length) {
      throw new Error(inputErrors.join(', '))
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

    if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
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

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titre.id,
      etape.typeId,
      'modification'
    )

    if (!titreEtapePermission) {
      throw new Error('droits insuffisants pour modifier cette étape')
    }

    const inputErrors = await titreEtapeInputValidate(etape, demarche)
    if (inputErrors.length) {
      throw new Error(inputErrors.join(', '))
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

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeOld = await titreEtapeGet(
      id,
      { fields: { documents: { type: { id: {} } } } },
      context.user?.id
    )
    if (!etapeOld) throw new Error("l'étape n'existe pas")

    const demarche = await titreDemarcheGet(
      etapeOld.titreDemarcheId,
      {},
      user && user.id
    )
    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(demarche.titreId, {}, user.id)
    if (!titre) throw new Error("le titre n'existe pas")

    const rulesErrors = await titreEtapeDeletionValidate(
      etapeOld,
      demarche,
      titre
    )
    if (rulesErrors) {
      throw new Error(rulesErrors)
    }

    await titreEtapeDelete(id)

    await fichiersDelete(etapeOld.documents)

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

const etapeJustificatifsAssocier = async (
  { id, documentsIds }: { id: string; documentsIds: string[] },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const etape = await titreEtapeGet(
      id,
      { fields: { justificatifs: { id: {} } } },
      context.user?.id
    )
    if (!etape) throw new Error("l'étape n'existe pas")

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

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titre.id,
      etape.typeId,
      'modification'
    )

    if (!titreEtapePermission) {
      throw new Error('droits insuffisants pour modifier cette étape')
    }

    await titreEtapeJustificatifsDelete(etape.id)

    const titreEtapeId = etape.id

    if (documentsIds.length) {
      await titresEtapesJustificatifsUpsert(
        documentsIds.map(
          documentId =>
            ({ documentId, titreEtapeId } as ITitreEtapeJustificatif)
        )
      )
    }

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titre.id, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeJustificatifDissocier = async (
  { id, documentId }: { id: string; documentId: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const etape = await titreEtapeGet(
      id,
      { fields: { justificatifs: { id: {} } } },
      context.user?.id
    )

    if (!etape) throw new Error("l'étape n'existe pas")

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

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titre.id,
      etape.typeId,
      'modification'
    )

    if (!titreEtapePermission) {
      throw new Error('droits insuffisants pour modifier cette étape')
    }

    await titreEtapeJustificatifsDelete(etape.id, documentId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titre.id, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  etapeJustificatifsAssocier,
  etapeJustificatifDissocier
}
