import permissionsCheck from './_permissions-check'
import auth from './_auth'
import { titreIsPublicTest } from './_restrictions'

import {
  titreGet,
  titresGet,
  titreAdd,
  titreDelete,
  titreUpsert
} from '../../database/queries/titres'

import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreUpdateTask from '../../tasks/titre-update'

import titreUpdateValidation from '../../tasks/titre-update-validation'

const titreRestrictions = titre => {
  titre.activites = []
  if (titre.demarches) {
    titre.demarches.forEach(td => {
      if (td.etapes) {
        td.etapes.forEach(te => {
          if (te.documents) {
            te.documents = te.documents.filter(ed => ed.public)
          }
        })
      }
    })
  }

  return titre
}

const titre = async ({ id }, context, info) => {
  const titre = await titreGet(id)

  if (!titre) return null

  const user = context.user && (await utilisateurGet(context.user.id))
  const userHasAccess = user && auth(user, titre, ['admin', 'super', 'editeur'])

  if (userHasAccess) {
    return titre
  }

  const titreIsPublic = titreIsPublicTest(titre.domaineId, titre.statutId)

  if (titreIsPublic) {
    return titreRestrictions(titre)
  }

  return null
}

const titres = async (
  {
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  },
  context,
  info
) => {
  // todo:
  // pour optimiser la requête sql en fonction de la requête graphql
  // construire un eager.options à passer à la requête sql
  // à partir de l'AST de graphQL
  // console.log(JSON.stringify(info.fragments, null, 2))
  // cf: https://github.com/graphql/graphql-js/issues/799

  const titres = await titresGet({
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  })

  const user = context.user && (await utilisateurGet(context.user.id))

  return titres.filter(titre => {
    const userHasAccess =
      user && auth(user, titre, ['admin', 'super', 'editeur'])

    if (userHasAccess) {
      return titre
    }

    const titreIsPublic = titreIsPublicTest(titre.domaineId, titre.statutId)

    if (titreIsPublic) {
      return titreRestrictions(titre)
    }

    return null
  })
}

const titreAjouter = async ({ titre }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  return titreAdd(titre)
}

const titreSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  return titreDelete(id)
}

const titreModifier = async ({ titre }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreUpdateValidation(titre)

  if (rulesError) {
    throw new Error(rulesError)
  }

  const res = await titreUpsert(titre)

  await titreUpdateTask(titre.id)

  return res
}

export { titre, titres, titreAjouter, titreSupprimer, titreModifier }
