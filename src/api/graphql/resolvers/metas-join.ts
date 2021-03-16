import {
  ITitreType,
  ITitreTypeTitreStatut,
  ITitreTypeDemarcheType,
  ITitreTypeDemarcheTypeEtapeType,
  IEtapeTypeEtapeStatut,
  IToken,
  ITravauxTypeEtapeType
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
  travauxTypesEtapesTypesGet,
  travauxTypeEtapeTypeUpdate,
  travauxTypeEtapeTypeCreate,
  travauxTypeEtapeTypeDelete,
  titreTypeGet
} from '../../../database/queries/metas'
import { titresDemarchesGet } from '../../../database/queries/titres-demarches'
import { userSuper } from '../../../database/user-super'

const titresTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypes = await titresTypesGet(null as never, {})

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

    const titresTypesDemarchesTypesEtapesTypes = await titresTypesDemarchesTypesEtapesTypesGet()

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

    const titresTypesDemarchesTypesEtapesTypes = await titresTypesDemarchesTypesEtapesTypesGet()

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

    const titresTypesDemarchesTypesEtapesTypes = await titresTypesDemarchesTypesEtapesTypesGet()

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
      { fields: { id: {} } },
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

    const titresTypesDemarchesTypesEtapesTypes = await titresTypesDemarchesTypesEtapesTypesGet()

    return titresTypesDemarchesTypesEtapesTypes
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

const travauxTypesEtapesTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxTypesEtapesTypes = await travauxTypesEtapesTypesGet()

    return travauxTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeEtapeTypeModifier = async (
  { travauxTypeEtapeType }: { travauxTypeEtapeType: ITravauxTypeEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxTypeEtapeTypeUpdate(
      travauxTypeEtapeType.travauxTypeId,
      travauxTypeEtapeType.etapeTypeId,
      travauxTypeEtapeType
    )

    const travauxTypesEtapesTypes = await travauxTypesEtapesTypesGet()

    return travauxTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeEtapeTypeCreer = async (
  { travauxTypeEtapeType }: { travauxTypeEtapeType: ITravauxTypeEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxTypeEtapeTypeCreate(travauxTypeEtapeType)

    const travauxTypesEtapesTypes = await travauxTypesEtapesTypesGet()

    return travauxTypesEtapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxTypeEtapeTypeSupprimer = async (
  { travauxTypeEtapeType }: { travauxTypeEtapeType: ITravauxTypeEtapeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await travauxTypeEtapeTypeDelete(
      travauxTypeEtapeType.travauxTypeId,
      travauxTypeEtapeType.etapeTypeId
    )

    const travauxTypesEtapesTypes = await travauxTypesEtapesTypesGet()

    return travauxTypesEtapesTypes
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
  etapesTypesEtapesStatuts,
  etapeTypeEtapeStatutModifier,
  etapeTypeEtapeStatutCreer,
  etapeTypeEtapeStatutSupprimer,
  travauxTypesEtapesTypes,
  travauxTypeEtapeTypeModifier,
  travauxTypeEtapeTypeCreer,
  travauxTypeEtapeTypeSupprimer
}
