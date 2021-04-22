import { GraphQLResolveInfo } from 'graphql'

import { IToken, ITitre, ITitreColonneId } from '../../../types'

import { debug } from '../../../config/index'
import { titreFormat, titresFormat } from '../../_format/titres'

import { fieldsBuild } from './_fields-build'

import {
  titreCreate,
  titreDelete,
  titreGet,
  titresCount,
  titresGet,
  titreUpsert
} from '../../../database/queries/titres'
import { userGet } from '../../../database/queries/utilisateurs'

import { titreFichiersDelete } from './_titre-document'

import titreUpdateTask from '../../../business/titre-update'

import { titreUpdationValidate } from '../../../business/validations/titre-updation-validate'
import { domaineGet } from '../../../database/queries/metas'

const titre = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const titre = await titreGet(id, { fields, fetchHeritage: true }, user)

    if (!titre) return null

    return titreFormat(titre, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titres = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    perimetre,
    typesIds,
    domainesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: ITitreColonneId | null
    ordre?: 'asc' | 'desc' | null
    perimetre?: number[] | null
    typesIds: string[]
    domainesIds: string[]
    statutsIds: string[]
    substances: string
    noms: string
    entreprises: string
    references: string
    territoires: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info).elements

    const [titres, total] = await Promise.all([
      titresGet(
        {
          intervalle,
          page,
          colonne,
          ordre,
          perimetre,
          typesIds,
          domainesIds,
          statutsIds,
          substances,
          noms,
          entreprises,
          references,
          territoires
        },
        { fields },
        user
      ),
      titresCount(
        {
          typesIds,
          domainesIds,
          statutsIds,
          substances,
          noms,
          entreprises,
          references,
          territoires
        },
        { fields: {} },
        user
      )
    ])

    const titresFormatted = titres && titresFormat(titres, fields)

    return {
      elements: titresFormatted,
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

const titreCreer = async (
  { titre }: { titre: ITitre },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const domaine = await domaineGet(
      titre.domaineId,
      { fields: { titresTypes: { id: {} } } },
      user
    )
    const titreType = domaine.titresTypes.find(tt => tt.id === titre.typeId)

    if (!user || !titreType?.titresCreation)
      throw new Error('droits insuffisants')

    // insert le titre dans la base
    titre = await titreCreate(titre, { fields: {} })

    const titreUpdatedId = await titreUpdateTask(titre.id)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreModifier = async (
  { titre }: { titre: ITitre },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreOld = await titreGet(titre.id, { fields: {} }, user)

    if (!titreOld) throw new Error("le titre n'existe pas")

    if (!titreOld.modification) throw new Error('droits insuffisants')

    const rulesErrors = await titreUpdationValidate(titre, titreOld)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    const fields = fieldsBuild(info)

    // on doit utiliser upsert (plutôt qu'un simple update)
    // car le titre contient des références (tableau d'objet)
    await titreUpsert(titre, { fields })

    const titreUpdatedId = await titreUpdateTask(titre.id)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  const user = await userGet(context.user?.id)

  const fields = fieldsBuild(info)

  const titreOld = await titreGet(id, { fields }, user)

  if (!titreOld) throw new Error("le titre n'existe pas")

  if (!titreOld.suppression) throw new Error('droits insuffisants')

  await titreFichiersDelete(titreOld)

  await titreDelete(id)

  return titreOld
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }
