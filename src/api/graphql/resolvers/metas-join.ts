import {
  ITitreType,
  ITitreTypeTitreStatut,
  ITitreTypeDemarcheType,
  ITitreTypeDemarcheTypeEtapeType,
  IEtapeTypeEtapeStatut,
  IToken,
  IEtapeTypeDocumentType,
  IEtapeTypeJustificatifType,
  ITitreTypeDemarcheTypeEtapeTypeDocumentType,
  ITitreTypeDemarcheTypeEtapeTypeJustificatifType
} from '../../../types'

import { debug } from '../../../config/index'

import { userGet } from '../../../database/queries/utilisateurs'

import { permissionCheck } from '../../../tools/permission'

import {
  titresTypesGet,
  titreTypeUpdate,
  titreTypeCreate,
  titreTypeDelete,
  titresTypesTitresStatutsGet,
  titreTypeTitreStatutCreate,
  titreTypeTitreStatutDelete,
  titreTypeTitreStatutUpdate,
  titresTypesDemarchesTypesGet,
  titreTypeDemarcheTypeUpdate,
  titreTypeDemarcheTypeCreate,
  titreTypeDemarcheTypeDelete,
  titresTypesDemarchesTypesEtapesTypesGet,
  titreTypeDemarcheTypeEtapeTypeUpdate,
  titreTypeDemarcheTypeEtapeTypeCreate,
  titreTypeDemarcheTypeEtapeTypeDelete,
  etapesTypesEtapesStatutsGet,
  etapeTypeEtapeStatutUpdate,
  etapeTypeEtapeStatutCreate,
  etapeTypeEtapeStatutDelete,
  titreTypeGet,
  etapesTypesDocumentsTypesGet,
  etapeTypeDocumentTypeUpdate,
  etapeTypeDocumentTypeCreate,
  etapeTypeDocumentTypeDelete,
  etapesTypesJustificatifsTypesGet,
  etapeTypeJustificatifTypeUpdate,
  etapeTypeJustificatifTypeCreate,
  etapeTypeJustificatifTypeDelete,
  etapeTypeGet,
  titresTypesDemarchesTypesEtapesTypesDocumentsTypesGet,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeCreate,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeDelete,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeUpdate,
  titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeUpdate,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeCreate,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeDelete
} from '../../../database/queries/metas'
import { titresDemarchesGet } from '../../../database/queries/titres-demarches'
import { userSuper } from '../../../database/user-super'
import {
  etapeTypeDocumentTypeUsedCheck,
  etapeTypeJustificatifTypeUsedCheck
} from '../../../database/queries/permissions/documents'
import { titresEtapesHeritageContenuUpdate } from '../../../business/processes/titres-etapes-heritage-contenu-update'
import { GraphQLResolveInfo } from 'graphql'
import { fieldsBuild } from './_fields-build'

const titresTypes = async (
  _: never,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    const titresTypes = await titresTypesGet(null as never, { fields })

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeModifier = async (
  { titreType }: { titreType: ITitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeUpdate(titreType.id!, titreType)

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeCreer = async (
  { titreType }: { titreType: ITitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeCreate(titreType)

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeSupprimer = async (
  { titreType }: { titreType: ITitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDelete(titreType.id)

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const titresTypesTitresStatuts = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeTitreStatutModifier = async (
  { titreTypeTitreStatut }: { titreTypeTitreStatut: ITitreTypeTitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeTitreStatutUpdate(
      titreTypeTitreStatut.titreTypeId,
      titreTypeTitreStatut.titreStatutId,
      titreTypeTitreStatut
    )

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeTitreStatutCreer = async (
  { titreTypeTitreStatut }: { titreTypeTitreStatut: ITitreTypeTitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeTitreStatutCreate(titreTypeTitreStatut)

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeTitreStatutSupprimer = async (
  { titreTypeTitreStatut }: { titreTypeTitreStatut: ITitreTypeTitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeTitreStatutDelete(
      titreTypeTitreStatut.titreTypeId,
      titreTypeTitreStatut.titreStatutId
    )

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titresTypesDemarchesTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypes = await titresTypesDemarchesTypesGet()

    return titresTypesDemarchesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeModifier = async (
  { titreTypeDemarcheType }: { titreTypeDemarcheType: ITitreTypeDemarcheType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeUpdate(
      titreTypeDemarcheType.titreTypeId,
      titreTypeDemarcheType.demarcheTypeId,
      titreTypeDemarcheType
    )

    const titresTypesDemarchesTypes = await titresTypesDemarchesTypesGet()

    return titresTypesDemarchesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeCreer = async (
  { titreTypeDemarcheType }: { titreTypeDemarcheType: ITitreTypeDemarcheType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeCreate(titreTypeDemarcheType)

    const titresTypesDemarchesTypes = await titresTypesDemarchesTypesGet()

    return titresTypesDemarchesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeSupprimer = async (
  { titreTypeDemarcheType }: { titreTypeDemarcheType: ITitreTypeDemarcheType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeDelete(
      titreTypeDemarcheType.titreTypeId,
      titreTypeDemarcheType.demarcheTypeId
    )

    const titresTypesDemarchesTypes = await titresTypesDemarchesTypesGet()

    return titresTypesDemarchesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const titresTypesDemarchesTypesEtapesTypes = async (
  _: never,
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypesEtapesTypes =
      await titresTypesDemarchesTypesEtapesTypesGet()

    return titresTypesDemarchesTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeModifier = async (
  {
    titreTypeDemarcheTypeEtapeType
  }: { titreTypeDemarcheTypeEtapeType: ITitreTypeDemarcheTypeEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeUpdate(
      titreTypeDemarcheTypeEtapeType.titreTypeId,
      titreTypeDemarcheTypeEtapeType.demarcheTypeId,
      titreTypeDemarcheTypeEtapeType.etapeTypeId,
      titreTypeDemarcheTypeEtapeType
    )

    await titresEtapesHeritageContenuUpdate()

    const titresTypesDemarchesTypesEtapesTypes =
      await titresTypesDemarchesTypesEtapesTypesGet()

    return titresTypesDemarchesTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeCreer = async (
  {
    titreTypeDemarcheTypeEtapeType
  }: { titreTypeDemarcheTypeEtapeType: ITitreTypeDemarcheTypeEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeCreate(titreTypeDemarcheTypeEtapeType)

    await titresEtapesHeritageContenuUpdate()

    const titresTypesDemarchesTypesEtapesTypes =
      await titresTypesDemarchesTypesEtapesTypesGet()

    return titresTypesDemarchesTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeSupprimer = async (
  {
    titreTypeDemarcheTypeEtapeType
  }: { titreTypeDemarcheTypeEtapeType: ITitreTypeDemarcheTypeEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titreType = await titreTypeGet(
      titreTypeDemarcheTypeEtapeType.titreTypeId
    )

    const demarches = await titresDemarchesGet(
      {
        titresTypesIds: [titreType.typeId],
        titresDomainesIds: [titreType.domaineId],
        typesIds: [titreTypeDemarcheTypeEtapeType.demarcheTypeId],
        etapesInclues: [{ typeId: titreTypeDemarcheTypeEtapeType.etapeTypeId }]
      },
      { fields: {} },
      userSuper
    )

    if (demarches.length) {
      throw new Error(
        `impossible de supprimer cette ligne car elle est utilisée par au moins une démarche ${demarches[0].id}`
      )
    }

    await titreTypeDemarcheTypeEtapeTypeDelete(
      titreTypeDemarcheTypeEtapeType.titreTypeId,
      titreTypeDemarcheTypeEtapeType.demarcheTypeId,
      titreTypeDemarcheTypeEtapeType.etapeTypeId
    )

    const titresTypesDemarchesTypesEtapesTypes =
      await titresTypesDemarchesTypesEtapesTypesGet()

    return titresTypesDemarchesTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const titresTypesDemarchesTypesEtapesTypesDocumentsTypes = async (
  _: never,
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypesEtapesTypesDocumentsTypes =
      await titresTypesDemarchesTypesEtapesTypesDocumentsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeDocumentTypeModifier = async (
  {
    titreTypeDemarcheTypeEtapeTypeDocumentType
  }: {
    titreTypeDemarcheTypeEtapeTypeDocumentType: ITitreTypeDemarcheTypeEtapeTypeDocumentType
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeDocumentTypeUpdate(
      titreTypeDemarcheTypeEtapeTypeDocumentType.titreTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType.demarcheTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType.etapeTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType.documentTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType
    )

    const titresTypesDemarchesTypesEtapesTypesDocumentsTypes =
      await titresTypesDemarchesTypesEtapesTypesDocumentsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeDocumentTypeCreer = async (
  {
    titreTypeDemarcheTypeEtapeTypeDocumentType
  }: {
    titreTypeDemarcheTypeEtapeTypeDocumentType: ITitreTypeDemarcheTypeEtapeTypeDocumentType
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeDocumentTypeCreate(
      titreTypeDemarcheTypeEtapeTypeDocumentType
    )

    const titresTypesDemarchesTypesEtapesTypesDocumentsTypes =
      await titresTypesDemarchesTypesEtapesTypesDocumentsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeDocumentTypeSupprimer = async (
  {
    titreTypeDemarcheTypeEtapeTypeDocumentType
  }: {
    titreTypeDemarcheTypeEtapeTypeDocumentType: ITitreTypeDemarcheTypeEtapeTypeDocumentType
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeDocumentTypeDelete(
      titreTypeDemarcheTypeEtapeTypeDocumentType.titreTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType.demarcheTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType.etapeTypeId,
      titreTypeDemarcheTypeEtapeTypeDocumentType.documentTypeId
    )

    const titresTypesDemarchesTypesEtapesTypesDocumentsTypes =
      await titresTypesDemarchesTypesEtapesTypesDocumentsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes = async (
  _: never,
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes =
      await titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeJustificatifTypeModifier = async (
  {
    titreTypeDemarcheTypeEtapeTypeJustificatifType
  }: {
    titreTypeDemarcheTypeEtapeTypeJustificatifType: ITitreTypeDemarcheTypeEtapeTypeJustificatifType
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeJustificatifTypeUpdate(
      titreTypeDemarcheTypeEtapeTypeJustificatifType.titreTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType.demarcheTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType.etapeTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType.documentTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType
    )

    const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes =
      await titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeJustificatifTypeCreer = async (
  {
    titreTypeDemarcheTypeEtapeTypeJustificatifType
  }: {
    titreTypeDemarcheTypeEtapeTypeJustificatifType: ITitreTypeDemarcheTypeEtapeTypeJustificatifType
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeJustificatifTypeCreate(
      titreTypeDemarcheTypeEtapeTypeJustificatifType
    )

    const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes =
      await titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeDemarcheTypeEtapeTypeJustificatifTypeSupprimer = async (
  {
    titreTypeDemarcheTypeEtapeTypeJustificatifType
  }: {
    titreTypeDemarcheTypeEtapeTypeJustificatifType: ITitreTypeDemarcheTypeEtapeTypeJustificatifType
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDemarcheTypeEtapeTypeJustificatifTypeDelete(
      titreTypeDemarcheTypeEtapeTypeJustificatifType.titreTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType.demarcheTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType.etapeTypeId,
      titreTypeDemarcheTypeEtapeTypeJustificatifType.documentTypeId
    )

    const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes =
      await titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const etapesTypesEtapesStatuts = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapesTypesEtapesStatuts = await etapesTypesEtapesStatutsGet()

    return etapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeEtapeStatutModifier = async (
  { etapeTypeEtapeStatut }: { etapeTypeEtapeStatut: IEtapeTypeEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await etapeTypeEtapeStatutUpdate(
      etapeTypeEtapeStatut.etapeTypeId,
      etapeTypeEtapeStatut.etapeStatutId,
      etapeTypeEtapeStatut
    )

    const etapesTypesEtapesStatuts = await etapesTypesEtapesStatutsGet()

    return etapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeEtapeStatutCreer = async (
  { etapeTypeEtapeStatut }: { etapeTypeEtapeStatut: IEtapeTypeEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await etapeTypeEtapeStatutCreate(etapeTypeEtapeStatut)

    const etapesTypesEtapesStatuts = await etapesTypesEtapesStatutsGet()

    return etapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeEtapeStatutSupprimer = async (
  { etapeTypeEtapeStatut }: { etapeTypeEtapeStatut: IEtapeTypeEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await etapeTypeEtapeStatutDelete(
      etapeTypeEtapeStatut.etapeTypeId,
      etapeTypeEtapeStatut.etapeStatutId
    )

    const etapesTypesEtapesStatuts = await etapesTypesEtapesStatutsGet()

    return etapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const etapesTypesDocumentsTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapesTypesDocumentsTypes = await etapesTypesDocumentsTypesGet()

    return etapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeDocumentTypeModifier = async (
  { etapeTypeDocumentType }: { etapeTypeDocumentType: IEtapeTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await etapeTypeDocumentTypeUpdate(
      etapeTypeDocumentType.etapeTypeId,
      etapeTypeDocumentType.documentTypeId,
      etapeTypeDocumentType
    )

    const etapesTypesDocumentsTypes = await etapesTypesDocumentsTypesGet()

    return etapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeDocumentTypeCreer = async (
  { etapeTypeDocumentType }: { etapeTypeDocumentType: IEtapeTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await etapeTypeDocumentTypeCreate(etapeTypeDocumentType)

    const etapesTypesDocumentsTypes = await etapesTypesDocumentsTypesGet()

    return etapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeDocumentTypeSupprimer = async (
  { etapeTypeDocumentType }: { etapeTypeDocumentType: IEtapeTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const used = await etapeTypeDocumentTypeUsedCheck(
      etapeTypeDocumentType.etapeTypeId,
      etapeTypeDocumentType.documentTypeId
    )

    if (used) {
      throw new Error(
        'impossible de supprimer cette jointure car elle est utilisée'
      )
    }

    await etapeTypeDocumentTypeDelete(
      etapeTypeDocumentType.etapeTypeId,
      etapeTypeDocumentType.documentTypeId
    )

    const etapesTypesDocumentsTypes = await etapesTypesDocumentsTypesGet()

    return etapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const etapesTypesJustificatifsTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapesTypesJustificatifsTypes =
      await etapesTypesJustificatifsTypesGet()

    return etapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeJustificatifTypeModifier = async (
  {
    etapeTypeJustificatifType
  }: { etapeTypeJustificatifType: IEtapeTypeJustificatifType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeType = await etapeTypeGet(
      etapeTypeJustificatifType.etapeTypeId,
      { fields: {} }
    )
    if (!etapeType.fondamentale) {
      throw new Error(
        `le type d’étape ${etapeType.id} (${etapeType.nom}) n’est pas fondamentale`
      )
    }

    await etapeTypeJustificatifTypeUpdate(
      etapeTypeJustificatifType.etapeTypeId,
      etapeTypeJustificatifType.documentTypeId,
      etapeTypeJustificatifType
    )

    const etapesTypesJustificatifsTypes =
      await etapesTypesJustificatifsTypesGet()

    return etapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeJustificatifTypeCreer = async (
  {
    etapeTypeJustificatifType
  }: { etapeTypeJustificatifType: IEtapeTypeJustificatifType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeType = await etapeTypeGet(
      etapeTypeJustificatifType.etapeTypeId,
      { fields: {} }
    )
    if (!etapeType.fondamentale) {
      throw new Error(
        `le type d’étape ${etapeType.id} (${etapeType.nom}) n’est pas fondamentale`
      )
    }

    await etapeTypeJustificatifTypeCreate(etapeTypeJustificatifType)

    const etapesTypesJustificatifsTypes =
      await etapesTypesJustificatifsTypesGet()

    return etapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeTypeJustificatifTypeSupprimer = async (
  {
    etapeTypeJustificatifType
  }: { etapeTypeJustificatifType: IEtapeTypeJustificatifType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const used = await etapeTypeJustificatifTypeUsedCheck(
      etapeTypeJustificatifType.etapeTypeId,
      etapeTypeJustificatifType.documentTypeId
    )

    if (used) {
      throw new Error(
        'impossible de supprimer cette jointure car elle est utilisée'
      )
    }

    await etapeTypeJustificatifTypeDelete(
      etapeTypeJustificatifType.etapeTypeId,
      etapeTypeJustificatifType.documentTypeId
    )

    const etapesTypesJustificatifsTypes =
      await etapesTypesJustificatifsTypesGet()

    return etapesTypesJustificatifsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  titresTypes,
  titreTypeModifier,
  titreTypeCreer,
  titreTypeSupprimer,
  titresTypesTitresStatuts,
  titreTypeTitreStatutModifier,
  titreTypeTitreStatutCreer,
  titreTypeTitreStatutSupprimer,
  titresTypesDemarchesTypes,
  titreTypeDemarcheTypeModifier,
  titreTypeDemarcheTypeCreer,
  titreTypeDemarcheTypeSupprimer,
  titresTypesDemarchesTypesEtapesTypes,
  titreTypeDemarcheTypeEtapeTypeModifier,
  titreTypeDemarcheTypeEtapeTypeCreer,
  titreTypeDemarcheTypeEtapeTypeSupprimer,
  titresTypesDemarchesTypesEtapesTypesDocumentsTypes,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeModifier,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeCreer,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeSupprimer,
  titresTypesDemarchesTypesEtapesTypesJustificatifsTypes,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeModifier,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeCreer,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeSupprimer,
  etapesTypesEtapesStatuts,
  etapeTypeEtapeStatutModifier,
  etapeTypeEtapeStatutCreer,
  etapeTypeEtapeStatutSupprimer,
  etapesTypesDocumentsTypes,
  etapeTypeDocumentTypeModifier,
  etapeTypeDocumentTypeCreer,
  etapeTypeDocumentTypeSupprimer,
  etapesTypesJustificatifsTypes,
  etapeTypeJustificatifTypeModifier,
  etapeTypeJustificatifTypeCreer,
  etapeTypeJustificatifTypeSupprimer
}
