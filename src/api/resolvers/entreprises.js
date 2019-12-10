import { debug } from '../../config/index'
import {
  entrepriseGet,
  entreprisesGet,
  entrepriseUpsert
} from '../../database/queries/entreprises'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import graphBuild from './_graph-build'
import titreGraphFormat from './_titre-graph-format'

import { entrepriseFormat, entreprisesFormat } from './format/entreprise'

import { permissionsCheck } from './permissions/permissions-check'
import { emailCheck } from './permissions/utilisateur'

import { entrepriseAndEtablissementsGet } from '../../tools/api-insee/index'

const entreprise = async ({ id }, context, info) => {
  try {
    const graph = graphBuild(fieldsBuild(info), 'entreprise', titreGraphFormat)
    const entreprise = await entrepriseGet(id, { graph })

    const user = context.user && (await utilisateurGet(context.user.id))

    if (!entreprise) {
      throw new Error('aucune entreprise référencée avec cet identifiant')
    }

    return entrepriseFormat(entreprise, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entreprises = async ({ noms }, context, info) => {
  try {
    const entreprises = await entreprisesGet(
      { noms },
      {
        graph: graphBuild(fieldsBuild(info), 'entreprise', titreGraphFormat)
      }
    )

    const user = context.user && (await utilisateurGet(context.user.id))

    return entreprisesFormat(entreprises, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entrepriseCreer = async ({ entreprise }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin', 'editeur'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (entreprise.paysId !== 'fr') {
      errors.push('impossible de créer une entreprise étrangère')
    }

    const entrepriseOld = await entrepriseGet(
      `${entreprise.paysId}-${entreprise.legalSiren}`
    )

    if (entrepriseOld) {
      errors.push(`l'entreprise ${entrepriseOld.nom} existe déjà dans Camino`)
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const entrepriseInsee = await entrepriseAndEtablissementsGet(
      entreprise.legalSiren
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

const entrepriseModifier = async ({ entreprise }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin', 'editeur'])) {
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
