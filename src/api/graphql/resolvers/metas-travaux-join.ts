import {
  IToken,
  ITravauxEtapeTypeDocumentType,
  ITravauxTypeTravauxEtapeType,
  ITravauxEtapeTypeEtapeStatut
} from '../../../types'

import { debug } from '../../../config/index'

import { userGet } from '../../../database/queries/utilisateurs'

import { permissionCheck } from '../../../tools/permission'

import {
  travauxTypesTravauxEtapesTypesGet,
  travauxTypeTravauxEtapeTypeUpdate,
  travauxTypeTravauxEtapeTypeCreate,
  travauxTypeTravauxEtapeTypeDelete,
  travauxEtapesTypesDocumentsTypesGet,
  travauxEtapeTypeDocumentTypeUpdate,
  travauxEtapeTypeDocumentTypeCreate,
  travauxEtapeTypeDocumentTypeDelete,
  travauxEtapesTypesEtapesStatutsGet,
  travauxEtapeTypeEtapeStatutUpdate,
  travauxEtapeTypeEtapeStatutCreate,
  travauxEtapeTypeEtapeStatutDelete
} from '../../../database/queries/metas-travaux'

//

const travauxTypesTravauxEtapesTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxTypesTravauxEtapesTypes =
      await travauxTypesTravauxEtapesTypesGet()

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

    const travauxTypesTravauxEtapesTypes =
      await travauxTypesTravauxEtapesTypesGet()

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

    const travauxTypesTravauxEtapesTypes =
      await travauxTypesTravauxEtapesTypesGet()

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

    const travauxTypesTravauxEtapesTypes =
      await travauxTypesTravauxEtapesTypesGet()

    return travauxTypesTravauxEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const travauxEtapesTypesDocumentsTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxEtapesTypesDocumentsTypes =
      await travauxEtapesTypesDocumentsTypesGet()

    return travauxEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeDocumentTypeModifier = async (
  {
    travauxEtapeTypeDocumentType
  }: { travauxEtapeTypeDocumentType: ITravauxEtapeTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxEtapeTypeDocumentTypeUpdate(
      travauxEtapeTypeDocumentType.travauxEtapeTypeId,
      travauxEtapeTypeDocumentType.documentTypeId,
      travauxEtapeTypeDocumentType
    )

    const travauxEtapesTypesDocumentsTypes =
      await travauxEtapesTypesDocumentsTypesGet()

    return travauxEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeDocumentTypeCreer = async (
  {
    travauxEtapeTypeDocumentType
  }: { travauxEtapeTypeDocumentType: ITravauxEtapeTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxEtapeTypeDocumentTypeCreate(travauxEtapeTypeDocumentType)

    const travauxEtapesTypesDocumentsTypes =
      await travauxEtapesTypesDocumentsTypesGet()

    return travauxEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeDocumentTypeSupprimer = async (
  {
    travauxEtapeTypeDocumentType
  }: { travauxEtapeTypeDocumentType: ITravauxEtapeTypeDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxEtapeTypeDocumentTypeDelete(
      travauxEtapeTypeDocumentType.travauxEtapeTypeId,
      travauxEtapeTypeDocumentType.documentTypeId
    )

    const travauxEtapesTypesDocumentsTypes =
      await travauxEtapesTypesDocumentsTypesGet()

    return travauxEtapesTypesDocumentsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

//

const travauxEtapesTypesEtapesStatuts = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxEtapesTypesEtapesStatuts =
      await travauxEtapesTypesEtapesStatutsGet()

    return travauxEtapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeEtapeStatutModifier = async (
  {
    travauxEtapeTypeEtapeStatut
  }: { travauxEtapeTypeEtapeStatut: ITravauxEtapeTypeEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxEtapeTypeEtapeStatutUpdate(
      travauxEtapeTypeEtapeStatut.travauxEtapeTypeId,
      travauxEtapeTypeEtapeStatut.etapeStatutId,
      travauxEtapeTypeEtapeStatut
    )

    const travauxEtapesTypesEtapesStatuts =
      await travauxEtapesTypesEtapesStatutsGet()

    return travauxEtapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeEtapeStatutCreer = async (
  {
    travauxEtapeTypeEtapeStatut
  }: { travauxEtapeTypeEtapeStatut: ITravauxEtapeTypeEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxEtapeTypeEtapeStatutCreate(travauxEtapeTypeEtapeStatut)

    const travauxEtapesTypesEtapesStatuts =
      await travauxEtapesTypesEtapesStatutsGet()

    return travauxEtapesTypesEtapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeTypeEtapeStatutSupprimer = async (
  {
    travauxEtapeTypeEtapeStatut
  }: { travauxEtapeTypeEtapeStatut: ITravauxEtapeTypeEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxEtapeTypeEtapeStatutDelete(
      travauxEtapeTypeEtapeStatut.travauxEtapeTypeId,
      travauxEtapeTypeEtapeStatut.etapeStatutId
    )

    const travauxEtapesTypesEtapesStatuts =
      await travauxEtapesTypesEtapesStatutsGet()

    return travauxEtapesTypesEtapesStatuts
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
  travauxTypeTravauxEtapeTypeSupprimer,
  travauxEtapesTypesDocumentsTypes,
  travauxEtapeTypeDocumentTypeModifier,
  travauxEtapeTypeDocumentTypeCreer,
  travauxEtapeTypeDocumentTypeSupprimer,
  travauxEtapesTypesEtapesStatuts,
  travauxEtapeTypeEtapeStatutModifier,
  travauxEtapeTypeEtapeStatutCreer,
  travauxEtapeTypeEtapeStatutSupprimer
}
