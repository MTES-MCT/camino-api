import { GraphQLResolveInfo } from 'graphql'

import {
  IToken,
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneId
} from '../../../types'

import { debug } from '../../../config/index'

import { fieldsBuild } from './_fields-build'

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

import titreDemarcheUpdateTask from '../../../business/titre-demarche-update'
import { titreDemarcheUpdationValidate } from '../../../business/validations/titre-demarche-updation-validate'
import { userGet } from '../../../database/queries/utilisateurs'

const demarche = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = await userGet(context.user?.id)

    const titreDemarche = await titreDemarcheGet(id, { fields }, user)

    if (!titreDemarche) {
      throw new Error("la démarche n'existe pas")
    }

    return titreDemarcheFormat(titreDemarche, fields.elements)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

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

    const user = await userGet(context.user?.id)

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
        user
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
        { fields: {} },
        user
      )
    ])

    const demarchesFormatted = titresDemarches.map(titreDemarche =>
      titreDemarcheFormat(titreDemarche, fields.elements)
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
    const user = await userGet(context.user?.id)

    const titre = await titreGet(demarche.titreId, { fields: {} }, user)

    if (!titre) throw new Error("le titre n'existe pas")

    if (!titre.demarchesCreation) throw new Error('droits insuffisants')

    const demarcheCreated = await titreDemarcheCreate(demarche)

    await titreDemarcheUpdateTask(demarcheCreated.id, demarcheCreated.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(
      demarcheCreated.titreId,
      { fields },
      user
    )

    return titreUpdated && titreFormat(titreUpdated)
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
    const user = await userGet(context.user?.id)

    if (!user) throw new Error('droits insuffisants')

    const demarcheOld = await titreDemarcheGet(
      demarche.id,
      {
        fields: { etapes: { id: {} } }
      },
      user
    )

    if (!demarcheOld) throw new Error('la démarche n’existe pas')

    if (!demarcheOld.modification) throw new Error('droits insuffisants')

    if (demarcheOld.titreId !== demarche.titreId)
      throw new Error('le titre n’existe pas')

    const rulesErrors = await titreDemarcheUpdationValidate(
      demarche,
      demarcheOld
    )

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreDemarcheUpdate(demarche.id, demarche)

    await titreDemarcheUpdateTask(demarche.id, demarche.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(demarche.titreId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
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
    const user = await userGet(context.user?.id)

    const demarcheOld = await titreDemarcheGet(
      id,
      { fields: { etapes: { id: {} } } },
      user
    )

    if (!demarcheOld) throw new Error("la démarche n'existe pas")

    if (!demarcheOld.suppression) throw new Error('droits insuffisants')

    await titreDemarcheDelete(id)

    await titreEtapesOrActivitesFichiersDelete('demarches', demarcheOld.etapes)

    await titreDemarcheUpdateTask(null, demarcheOld.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(demarcheOld.titreId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  demarche,
  demarches,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
}
