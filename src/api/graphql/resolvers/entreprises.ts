import { IToken, IEntreprise, IEntrepriseColonneId } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'

import { debug } from '../../../config/index'
import {
  entrepriseGet,
  entreprisesGet,
  entrepriseUpsert,
  entreprisesCount
} from '../../../database/queries/entreprises'
import { userGet } from '../../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'

import { entrepriseFormat } from '../../_format/entreprises'

import { permissionCheck } from '../../../tools/permission'
import { emailCheck } from '../../../tools/email-check'

import { entrepriseAndEtablissementsGet } from '../../../tools/api-insee/index'

const entreprise = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const entreprise = await entrepriseGet(id, { fields }, context.user?.id)

    if (!entreprise) {
      throw new Error('aucune entreprise référencée avec cet identifiant')
    }

    const user = context.user && (await userGet(context.user.id))

    return entrepriseFormat(user, entreprise)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entreprises = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IEntrepriseColonneId | null
    noms?: string | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const entreprises = await entreprisesGet(
      {
        page,
        intervalle,
        ordre,
        colonne,
        noms
      },
      { fields: fields.elements },
      context.user?.id
    )

    const total = await entreprisesCount(
      { noms },
      { fields: fields.elements },
      context.user?.id
    )

    if (!entreprises.length) return { elements: [], total: 0 }

    const user = context.user && (await userGet(context.user.id))

    return {
      elements: entreprises.map(e => entrepriseFormat(user, e)),
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

const entrepriseCreer = async (
  { entreprise }: { entreprise: IEntreprise },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user, ['super', 'admin', 'editeur'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (entreprise.paysId !== 'fr') {
      errors.push('impossible de créer une entreprise étrangère')
    }

    const fields = fieldsBuild(info)

    const entrepriseOld = await entrepriseGet(
      `${entreprise.paysId}-${entreprise.legalSiren}`,
      { fields },
      context.user?.id
    )

    if (entrepriseOld) {
      errors.push(`l'entreprise ${entrepriseOld.nom} existe déjà dans Camino`)
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const entrepriseInsee = await entrepriseAndEtablissementsGet(
      entreprise.legalSiren!
    )

    if (!entrepriseInsee) {
      throw new Error('numéro de siren non reconnu dans la base Insee')
    }

    const entrepriseNew = await entrepriseUpsert(entrepriseInsee)

    return entrepriseNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entrepriseModifier = async (
  { entreprise }: { entreprise: IEntreprise },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user, ['super', 'admin', 'editeur'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (entreprise.email && !emailCheck(entreprise.email)) {
      errors.push('adresse email invalide')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const entrepriseUpserted = await entrepriseUpsert(entreprise)

    const fields = fieldsBuild(info)

    const entrepriseNew = await entrepriseGet(
      entrepriseUpserted.id,
      { fields },
      context.user?.id
    )

    return entrepriseNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { entreprise, entreprises, entrepriseCreer, entrepriseModifier }
