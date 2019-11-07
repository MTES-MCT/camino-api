import {
  entrepriseGet,
  entreprisesGet,
  entrepriseUpsert
} from '../../database/queries/entreprises'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import { entrepriseFormat, entreprisesFormat } from './_entreprise'
import { permissionsCheck } from './_permissions-check'

import { emailCheck } from './_utilisateur'

import { entrepriseAndEtablissementsGet } from '../../tools/api-insee/index'

const entreprise = async ({ id }, context, info) => {
  const entreprise = await entrepriseGet(id, {
    eager: eagerBuild(fieldsBuild(info), 'entreprise', titreEagerFormat)
  })

  const user = context.user && (await utilisateurGet(context.user.id))

  if (!entreprise) {
    throw new Error('aucune entreprise référencée avec cet identifiant')
  }

  return entrepriseFormat(entreprise, user)
}

const entreprises = async ({ noms }, context, info) => {
  const entreprises = await entreprisesGet(
    { noms },
    {
      eager: eagerBuild(fieldsBuild(info), 'entreprise', titreEagerFormat)
    }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  return entreprisesFormat(entreprises, user)
}

const entrepriseCreer = async ({ entreprise }, context) => {
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
}

const entrepriseModifier = async ({ entreprise }, context) => {
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
}

export { entreprise, entreprises, entrepriseCreer, entrepriseModifier }
