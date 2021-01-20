import {
  IToken,
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneId
} from '../../../types'
import { GraphQLResolveInfo } from 'graphql'

import { debug } from '../../../config/index'

import fieldsBuild from './_fields-build'

import { permissionCheck } from '../../../tools/permission'

import { titreEtapesOrActivitesFichiersDelete } from './_titre-document'

import { titreFormat } from '../../_format/titres'

import { titreDemarcheFormat } from '../../_format/titres-demarches'

import {
  titreDemarcheGet,
  titresDemarchesCount,
  titresDemarchesGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../../database/queries/titres-demarches'

import { titreGet } from '../../../database/queries/titres'
import { userGet } from '../../../database/queries/utilisateurs'

import titreDemarcheUpdateTask from '../../../business/titre-demarche-update'
import titreDemarcheUpdationValidate from '../../../business/validations/titre-demarche-updation-validate'

const demarches = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreDemarcheColonneId | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    if (!intervalle) {
      intervalle = 200
    }

    if (!page) {
      page = 1
    }

    const userId = context.user?.id

    const [titresDemarches, total] = await Promise.all([
      titresDemarchesGet(
        {
          intervalle,
          page,
          ordre,
          colonne,
          typesIds,
          statutsIds,
          etapesInclues,
          etapesExclues,
          titresTypesIds,
          titresDomainesIds,
          titresStatutsIds,
          titresNoms,
          titresEntreprises,
          titresSubstances,
          titresReferences,
          titresTerritoires
        },
        { fields: fields.elements },
        userId
      ),
      titresDemarchesCount(
        {
          typesIds,
          statutsIds,
          etapesInclues,
          etapesExclues,
          titresTypesIds,
          titresDomainesIds,
          titresStatutsIds,
          titresNoms,
          titresEntreprises,
          titresSubstances,
          titresReferences,
          titresTerritoires
        },
        { fields: { id: {} } },
        userId
      )
    ])

    const user = context.user && (await userGet(context.user.id))

    const demarchesFormatted = titresDemarches.map(titreDemarche =>
      titreDemarcheFormat(
        user,
        titreDemarche,
        titreDemarche.titre!.typeId,
        fields.elements
      )
    )

    return {
      elements: demarchesFormatted,
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

const demarcheCreer = async (
  { demarche }: { demarche: ITitreDemarche },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    const demarcheCreated = await titreDemarcheCreate(
      demarche,
      { fields: { id: {} } },
      user?.id
    )

    const titreUpdatedId = await titreDemarcheUpdateTask(
      demarcheCreated.id,
      demarcheCreated.titreId
    )

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user?.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheModifier = async (
  { demarche }: { demarche: ITitreDemarche },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const titre = await titreGet(
      demarche.titreId,
      { fields: { id: {} } },
      user.id
    )
    if (!titre) throw new Error("le titre n'existe pas")

    const rulesErrors = await titreDemarcheUpdationValidate(demarche)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    const demarcheUpdated = await titreDemarcheUpdate(
      demarche.id,
      demarche,
      { fields: { id: {} } },
      user.id,
      titre
    )

    const titreUpdatedId = await titreDemarcheUpdateTask(
      demarcheUpdated.id,
      demarcheUpdated.titreId
    )

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const demarcheOld = await titreDemarcheGet(
      id,
      { fields: { etapes: { documents: { type: { id: {} } } } } },
      user.id
    )
    if (!demarcheOld) throw new Error("la démarche n'existe pas")

    await titreDemarcheDelete(id)

    await titreEtapesOrActivitesFichiersDelete(demarcheOld.etapes)

    const titreUpdatedId = await titreDemarcheUpdateTask(
      null,
      demarcheOld.titreId
    )

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { demarches, demarcheCreer, demarcheModifier, demarcheSupprimer }
