import { ITitreEtape, ITitreEtapeJustificatif, IToken } from '../../../types'

import { debug } from '../../../config/index'

import { titreFormat } from '../../_format/titres'

import { permissionCheck } from '../../../tools/permission'
import { titreEtapePermissionAdministrationsCheck } from '../../_permissions/titre-edition'

import {
  titreEtapeDelete,
  titreEtapeGet,
  titreEtapeJustificatifsDelete,
  titreEtapeUpsert,
  titresEtapesJustificatifsUpsert
} from '../../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreGet } from '../../../database/queries/titres'
import { userGet } from '../../../database/queries/utilisateurs'

import { fichiersDelete } from './_titre-document'

import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import { titreEtapeBuild, titreEtapePointsCalc } from './_titre-etape'
import { titreEtapeInputValidate } from '../../_validate/titre-etape-input-validate'
import { titreEtapeUpdationValidate } from '../../../business/validations/titre-etape-updation-validate'

import { GraphQLResolveInfo } from 'graphql'
import fieldsBuild from './_fields-build'
import { titreDemarcheUpdatedEtatValidate } from '../../../business/validations/titre-demarche-etat-validate'
import { titreEtapeFormat } from '../../_format/titres-etapes'
import { etapeTypeGet } from '../../../database/queries/metas'

const etape = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (!fields.type) {
      fields.type = { id: {} }
    }

    const titreEtape = await titreEtapeGet(
      id,
      { fields, fetchHeritage: true },
      context?.user?.id
    )

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      {
        fields: {
          titre: { id: {} },
          type: { etapesTypes: { id: {} } }
        }
      },
      user && user.id
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    return titreEtapeFormat(
      titreEtape,
      titreDemarche.titre!.typeId,
      titreDemarche.type!.etapesTypes!
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeHeritage = async (
  {
    date,
    titreDemarcheId,
    typeId
  }: { date: string; titreDemarcheId: string; typeId: string },
  context: IToken
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    let titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      { fields: { id: {} } },
      user && user.id
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { id: {} } },
          titre: { id: {} },
          etapes: {
            type: { id: {} },
            statut: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            substances: { legales: { code: { id: {} } } },
            points: { references: { geoSysteme: { unite: { id: {} } } } }
          }
        }
      },
      'super'
    )

    const etapeType = await etapeTypeGet(typeId)

    return titreEtapeBuild(date, etapeType, titreDemarche)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

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

    let titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      { fields: { id: {} } },
      user && user.id
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { etapesStatuts: { id: {} } } },
          titre: {
            type: { demarchesTypes: { id: {} } },
            demarches: { etapes: { id: {} } }
          },
          etapes: { type: { id: {} } }
        }
      },
      'super'
    )

    if (!titreDemarche.titre) throw new Error("le titre n'existe pas")

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titreDemarche.titre.id,
      etape.typeId,
      'creation'
    )

    if (!titreEtapePermission) {
      throw new Error('droits insuffisants pour créer cette étape')
    }

    const etapeType = await etapeTypeGet(etape.typeId)
    if (!etapeType) {
      throw new Error(`etape type "${etape.typeId}" inconnu `)
    }

    const inputErrors = await titreEtapeInputValidate(
      etape,
      titreDemarche,
      etapeType
    )

    if (inputErrors.length) {
      throw new Error(inputErrors.join(', '))
    }

    const rulesErrors = await titreEtapeUpdationValidate(
      etape,
      titreDemarche,
      titreDemarche.titre
    )
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

    return titreFormat(titreUpdated)
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

    let titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      { fields: { id: {} } },
      user && user.id
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { etapesStatuts: { id: {} } } },
          titre: {
            type: { demarchesTypes: { id: {} } },
            demarches: { etapes: { id: {} } }
          },
          etapes: { type: { id: {} } }
        }
      },
      'super'
    )

    if (!titreDemarche.titre) throw new Error("le titre n'existe pas")

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titreDemarche.titre.id,
      etape.typeId,
      'modification'
    )

    if (!titreEtapePermission) {
      throw new Error('droits insuffisants pour modifier cette étape')
    }

    const etapeType = await etapeTypeGet(etape.typeId)
    if (!etapeType) {
      throw new Error(`etape type "${etape.typeId}" inconnu `)
    }

    const inputErrors = await titreEtapeInputValidate(
      etape,
      titreDemarche,
      etapeType
    )
    if (inputErrors.length) {
      throw new Error(inputErrors.join(', '))
    }

    const rulesErrors = await titreEtapeUpdationValidate(
      etape,
      titreDemarche,
      titreDemarche.titre
    )

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

    return titreFormat(titreUpdated)
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

    const titreEtape = await titreEtapeGet(
      id,
      { fields: { documents: { type: { id: {} } } } },
      context.user?.id
    )
    if (!titreEtape) throw new Error("l'étape n'existe pas")

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { etapesStatuts: { id: {} } } },
          titre: {
            type: { demarchesTypes: { id: {} } },
            demarches: { etapes: { id: {} } }
          },
          etapes: { type: { id: {} } }
        }
      },
      'super'
    )
    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    if (!titreDemarche.titre) throw new Error("le titre n'existe pas")

    const rulesErrors = await titreDemarcheUpdatedEtatValidate(
      titreDemarche.type!,
      titreDemarche.titre,
      titreEtape,
      titreDemarche.etapes!,
      true
    )

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreEtapeDelete(id)

    await fichiersDelete(titreEtape.documents)

    const titreUpdatedId = await titreEtapeUpdateTask(
      null,
      titreEtape.titreDemarcheId
    )

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreFormat(titreUpdated)
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

    const titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {},
      user && user.id
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      titreDemarche.titreId,
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

    return titreFormat(titreUpdated)
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

    const titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {},
      user && user.id
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      titreDemarche.titreId,
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

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  etape,
  etapeHeritage,
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  etapeJustificatifsAssocier,
  etapeJustificatifDissocier
}
