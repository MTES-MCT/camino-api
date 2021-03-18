import { GraphQLResolveInfo } from 'graphql'
import {
  IActiviteStatut,
  IActiviteType,
  IActiviteTypeDocumentType,
  IActiviteTypePays,
  IActiviteTypeTitreType,
  IToken
} from '../../../types'
import { debug } from '../../../config'
import fieldsBuild from './_fields-build'
import { userGet } from '../../../database/queries/utilisateurs'
import {
  activitesTypesGet,
  activitesStatutsGet,
  activiteTypeUpdate,
  activiteStatutUpdate,
  activiteTypeTitreTypeCreate,
  activitesTypesTitresTypesGet,
  activiteTypeTitreTypeDelete,
  activiteTypeDocumentTypeCreate,
  activitesTypesDocumentsTypesGet,
  activiteTypeDocumentTypeDelete,
  activiteTypePaysCreate,
  activitesTypesPaysGet,
  activiteTypePaysDelete
} from '../../../database/queries/metas-activites'
import { permissionCheck } from '../../../tools/permission'
import ordreUpdate from './_ordre-update'

const activitesTypes = async (
  _: never,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const activitesTypes = await activitesTypesGet({ fields }, user)

    return activitesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activitesStatuts = async () => {
  try {
    const activitesStatuts = await activitesStatutsGet()

    return activitesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypeModifier = async (
  { activiteType }: { activiteType: IActiviteType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (activiteType.ordre) {
      const activitesTypes = await activitesTypesGet({ fields }, user)

      await ordreUpdate(activiteType, activitesTypes, activiteTypeUpdate)
    }

    await activiteTypeUpdate(activiteType.id!, activiteType)

    const activitesTypes = await activitesTypesGet({ fields }, user)

    return activitesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteStatutModifier = async (
  { activiteStatut }: { activiteStatut: IActiviteStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteStatutUpdate(activiteStatut.id!, activiteStatut)

    const activitesStatuts = await activitesStatutsGet()

    return activitesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypeTitreTypeCreer = async (
  { activiteTypeTitreType }: { activiteTypeTitreType: IActiviteTypeTitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteTypeTitreTypeCreate(activiteTypeTitreType)

    const activitesTypesTitresTypes = await activitesTypesTitresTypesGet()

    return activitesTypesTitresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypeTitreTypeSupprimer = async (
  { activiteTypeTitreType }: { activiteTypeTitreType: IActiviteTypeTitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteTypeTitreTypeDelete({
      activiteTypeId: activiteTypeTitreType.activiteTypeId,
      titreTypeId: activiteTypeTitreType.titreTypeId
    })

    const activitesTypesTitresTypes = await activitesTypesTitresTypesGet()

    return activitesTypesTitresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypeDocumentTypeCreer = async (
  {
    activiteTypeDocumentType
  }: { activiteTypeDocumentType: IActiviteTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteTypeDocumentTypeCreate(activiteTypeDocumentType)

    const activitesTypesDocumentsTypes = await activitesTypesDocumentsTypesGet()

    return activitesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypeDocumentTypeSupprimer = async (
  {
    activiteTypeDocumentType
  }: { activiteTypeDocumentType: IActiviteTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteTypeDocumentTypeDelete({
      activiteTypeId: activiteTypeDocumentType.activiteTypeId,
      documentTypeId: activiteTypeDocumentType.documentTypeId
    })

    const activitesTypesDocumentsTypes = await activitesTypesDocumentsTypesGet()

    return activitesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypePaysCreer = async (
  { activiteTypePays }: { activiteTypePays: IActiviteTypePays },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteTypePaysCreate(activiteTypePays)

    const activitesTypesDocumentsPays = await activitesTypesPaysGet()

    return activitesTypesDocumentsPays
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteTypePaysSupprimer = async (
  { activiteTypePays }: { activiteTypePays: IActiviteTypePays },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await activiteTypePaysDelete({
      activiteTypeId: activiteTypePays.activiteTypeId,
      paysId: activiteTypePays.paysId
    })

    const activitesTypesDocumentsPays = await activitesTypesPaysGet()

    return activitesTypesDocumentsPays
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  activitesTypes,
  activiteTypeModifier,
  activitesStatuts,
  activiteStatutModifier,
  activiteTypeTitreTypeCreer,
  activiteTypeTitreTypeSupprimer,
  activiteTypeDocumentTypeCreer,
  activiteTypeDocumentTypeSupprimer,
  activiteTypePaysCreer,
  activiteTypePaysSupprimer
}
