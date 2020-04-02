import { IToken, IEntreprise } from '../../types'
import { GraphQLResolveInfo } from 'graphql'

import { debug } from '../../config/index'
import {
  entrepriseGet,
  entreprisesGet,
  entrepriseUpsert
} from '../../database/queries/entreprises'
import { userGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'

import { entrepriseFormat } from './format/entreprises'

import { permissionsCheck } from './permissions/permissions-check'
import { emailCheck } from './permissions/utilisateur'

import { entrepriseAndEtablissementsGet } from '../../tools/api-insee/index'

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
  { noms }: { noms: string[] },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const entreprises = await entreprisesGet(
      { noms },
      { fields },
      context.user?.id
    )

    const user = context.user && (await userGet(context.user.id))

    return entreprises.map(e => entrepriseFormat(user, e))
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

    if (!permissionsCheck(user, ['super', 'admin', 'editeur'])) {
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

    if (!permissionsCheck(user, ['super', 'admin', 'editeur'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (entreprise.email && !emailCheck(entreprise.email)) {
      errors.push('adresse email invalide')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const entrepriseNew = await entrepriseUpsert(entreprise)

    return entrepriseNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { entreprise, entreprises, entrepriseCreer, entrepriseModifier }
