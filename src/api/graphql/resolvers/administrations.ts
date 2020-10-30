import {
  IAdministrationColonneId,
  IAdministrationTitreType,
  IAdministrationTitreTypeEtapeType,
  IAdministrationTitreTypeTitreStatut,
  IToken
} from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../../config/index'
import {
  administrationGet,
  administrationsGet,
  administrationsCount,
  administrationUpdate,
  administrationTitreTypeDelete,
  administrationTitreTypeUpsert,
  administrationTitreTypeTitreStatutUpsert,
  administrationTitreTypeTitreStatutDelete,
  administrationTitreTypeEtapeTypeDelete,
  administrationTitreTypeEtapeTypeUpsert
} from '../../../database/queries/administrations'
import { userGet } from '../../../database/queries/utilisateurs'

import administrationUpdateTask from '../../../business/administration-update'

import fieldsBuild from './_fields-build'

import { administrationFormat } from '../../_format/administrations'
import { permissionCheck } from '../../../tools/permission'
import { emailCheck } from '../../../tools/email-check'

const administration = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const fields = fieldsBuild(info)

    const administration = await administrationGet(
      id,
      { fields },
      context.user?.id
    )

    return administrationFormat(user, administration)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrations = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    typesIds
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IAdministrationColonneId | null
    noms?: string | null
    typesIds?: string[] | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    const fields = fieldsBuild(info)

    const [administrations, total] = await Promise.all([
      administrationsGet(
        { page, intervalle, ordre, colonne, noms, typesIds },
        { fields: fields.elements },
        context.user?.id
      ),
      administrationsCount(
        { noms, typesIds },
        { fields: fields.elements },
        context.user?.id
      )
    ])

    if (!administrations.length) return { elements: [], total: 0 }

    return {
      elements: administrations.map(a => administrationFormat(user, a)),
      page,
      intervalle,
      ordre,
      colonne,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrationModifier = async (
  {
    administration
  }: {
    administration: {
      id: string
      typeId: string
      nom: string
      abreviation: string
      service?: string
      url?: string
      email?: string
      telephone?: string
      adresse1?: string
      adresse2?: string
      codePostal?: string
      commune?: string
      cedex?: string
      departementId?: string
      regionId?: string
    }
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (administration.email && !emailCheck(administration.email)) {
      errors.push('adresse email invalide')
    }

    const fields = fieldsBuild(info)

    const administrationOld = await administrationGet(
      administration.id,
      { fields },
      context.user?.id
    )

    if (!administrationOld) {
      errors.push('administration inconnue')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const administrationUpdated = await administrationUpdate(
      administration.id,
      administration
    )

    const administrationId = await administrationUpdateTask(
      administrationUpdated.id
    )

    return await administrationGet(
      administrationId,
      { fields },
      context.user?.id
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrationTitreTypeModifier = async (
  {
    administrationTitreType
  }: { administrationTitreType: IAdministrationTitreType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const fields = fieldsBuild(info)

    if (
      !administrationTitreType.gestionnaire &&
      !administrationTitreType.associee
    ) {
      await administrationTitreTypeDelete(
        administrationTitreType.administrationId,
        administrationTitreType.titreTypeId
      )
    } else {
      await administrationTitreTypeUpsert(administrationTitreType)
    }

    return await administrationGet(
      administrationTitreType.administrationId,
      { fields },
      context.user?.id
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrationTitreTypeTitreStatutModifier = async (
  {
    administrationTitreTypeTitreStatut
  }: {
    administrationTitreTypeTitreStatut: IAdministrationTitreTypeTitreStatut
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    console.log(administrationTitreTypeTitreStatut)

    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const fields = fieldsBuild(info)

    if (
      !administrationTitreTypeTitreStatut.titresModificationInterdit &&
      !administrationTitreTypeTitreStatut.demarchesModificationInterdit &&
      !administrationTitreTypeTitreStatut.etapesModificationInterdit
    ) {
      await administrationTitreTypeTitreStatutDelete(
        administrationTitreTypeTitreStatut.administrationId,
        administrationTitreTypeTitreStatut.titreTypeId,
        administrationTitreTypeTitreStatut.titreStatutId
      )
    } else {
      await administrationTitreTypeTitreStatutUpsert(
        administrationTitreTypeTitreStatut
      )
    }

    return await administrationGet(
      administrationTitreTypeTitreStatut.administrationId,
      { fields },
      context.user?.id
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrationTitreTypeEtapeTypeModifier = async (
  {
    administrationTitreTypeEtapeType
  }: {
    administrationTitreTypeEtapeType: IAdministrationTitreTypeEtapeType
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const fields = fieldsBuild(info)

    if (
      !administrationTitreTypeEtapeType.lectureInterdit &&
      !administrationTitreTypeEtapeType.modificationInterdit &&
      !administrationTitreTypeEtapeType.creationInterdit
    ) {
      await administrationTitreTypeEtapeTypeDelete(
        administrationTitreTypeEtapeType.administrationId,
        administrationTitreTypeEtapeType.titreTypeId,
        administrationTitreTypeEtapeType.etapeTypeId
      )
    } else {
      await administrationTitreTypeEtapeTypeUpsert(
        administrationTitreTypeEtapeType
      )
    }

    return await administrationGet(
      administrationTitreTypeEtapeType.administrationId,
      { fields },
      context.user?.id
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  administration,
  administrations,
  administrationModifier,
  administrationTitreTypeModifier,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier
}
