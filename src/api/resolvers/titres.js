import permissionsCheck from './_permissions-check'
import { titreFormat } from '../../database/format'
import { restrictedDomaineIds, restrictedStatutIds } from './_restrictions'

import {
  titreGet,
  titresGet,
  titreAdd,
  titreRemove,
  titreUpdate
} from '../../database/queries/titres'

import { domainesGet, statutsGet } from '../../database/queries/metas'
import { titreEtapeUpsert } from '../../database/queries/titres-etapes'
import { utilisateurGet } from '../../database/queries/utilisateurs'
import { dupRemove, dupFind } from '../../tools/index'
import titreEtapeUpdateTasks from '../../tasks/etape-update'

const titreRestrictions = (titre, userHasAccess) => {
  if (!userHasAccess) {
    titre.activites = []
  }

  return titre
}

const titre = async ({ id }, context, info) => {
  const titre = await titreGet(id)

  if (!titre) return null

  const userEntreprisePermissionsGet = async (userId, titreEntrepriseIds) => {
    const utilisateur = await utilisateurGet(userId)
    const entrepriseId = utilisateur.entreprise && utilisateur.entreprise.id
    return titreEntrepriseIds.some(id => id === entrepriseId)
  }

  const titreIsPublicTest = (titreDomaineId, titreStatutId) =>
    !restrictedDomaineIds.includes(titreDomaineId) &&
    !restrictedStatutIds.includes(titreStatutId)

  const titreEntrepriseIdsGet = (titreTitulaires, titreAmodiataires) => [
    ...titreTitulaires.map(t => t.id),
    ...titreAmodiataires.map(t => t.id)
  ]

  const userHasAccessTest = async (user, titreEntrepriseIds) =>
    permissionsCheck(user, ['admin', 'super']) ||
    userEntreprisePermissionsGet(user.id, titreEntrepriseIds)

  const userHasAccess =
    context.user &&
    (await userHasAccessTest(
      context.user,
      titreEntrepriseIdsGet(titre.titulaires, titre.amodiataires)
    ))

  const titreIsPublic = titreIsPublicTest(titre.domaineId, titre.statutId)

  return titreIsPublic || userHasAccess
    ? titreFormat(titreRestrictions(titre, userHasAccess))
    : null
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

  const userIsAdmin =
    context.user && permissionsCheck(context.user, ['admin', 'super'])

  const domaineIdsRestrict = async domaineIds => {
    if (!domaineIds) {
      const domaines = await domainesGet()
      domaineIds = domaines.map(domaine => domaine.id)
    }

    return domaineIds.filter(id => !restrictedDomaineIds.includes(id))
  }

  const statutIdsRestrict = async statutIds => {
    if (!statutIds) {
      const statuts = await statutsGet()
      statutIds = statuts.map(statut => statut.id)
    }

    return statutIds.filter(id => !restrictedStatutIds.includes(id))
  }

  const titresUserEntrepriseFind = async (
    userId,
    {
      typeIds,
      domaineIds,
      statutIds,
      substances,
      noms,
      entreprises,
      references,
      territoires
    }
  ) => {
    const user = await utilisateurGet(userId)
    const entrepriseId = user && user.entreprise && user.entreprise.id

    // si l'utilisateur appartient à une entreprise
    if (entrepriseId) {
      // les titres qui correspondent au filtre `entreprises`
      const titresFilterEntreprises =
        entreprises &&
        (await titresGet({
          typeIds,
          domaineIds,
          statutIds,
          substances,
          noms,
          entreprises,
          references,
          territoires
        }))

      // les titres qui correspondent à l'entreprise de l'utilisateur
      const titresUserEntreprise = await titresGet({
        typeIds,
        domaineIds,
        statutIds,
        substances,
        noms,
        entreprises: [entrepriseId],
        references,
        territoires
      })

      // si le filtre `entreprises` est renseigné,
      return entreprises
        ? // on doit faire deux requêtes:
          // et on ne garde que les éléments présent dans les deux
          dupFind('id', titresFilterEntreprises, titresUserEntreprise)
        : // sinon on ne fait qu'une requête
          titresUserEntreprise
    }

    return []
  }

  const titresUserEntreprise =
    context.user && permissionsCheck(context.user, ['entreprise'])
      ? await titresUserEntrepriseFind(context.user.id, {
          typeIds,
          domaineIds,
          statutIds,
          substances,
          noms,
          entreprises,
          references,
          territoires
        })
      : []

  const titresPublics = await titresGet({
    typeIds,
    domaineIds: userIsAdmin ? domaineIds : await domaineIdsRestrict(domaineIds),
    statutIds: userIsAdmin ? statutIds : await statutIdsRestrict(statutIds),
    substances,
    noms,
    entreprises,
    references,
    territoires
  })

  const titres = dupRemove(
    'id',
    titresUserEntreprise,
    titresPublics.map(t => titreRestrictions(t, userIsAdmin))
  )

  return titres.map(titre => titre && titreFormat(titre))
}

const titreAjouter = async ({ titre }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (!errors.length) {
    return titreAdd(titre)
  } else {
    throw new Error(errors.join(', '))
  }
}

const titreSupprimer = async ({ id }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (!errors.length) {
    return titreRemove(id)
  } else {
    throw new Error(errors.join(', '))
  }
}

const titreModifier = async ({ titre }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (!errors.length) {
    return titreUpdate(titre)
  } else {
    throw new Error(errors.join(', '))
  }
}

const titreEtapeModifier = async ({ etape }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (!errors.length) {
    // si l'id de l'étape ne correspond pas à son type
    const etapeTypeIdSlug = etape.id.slice(-5, -2)
    const etapeTypeId = etape.type.id
    console.log(etapeTypeIdSlug, etapeTypeId)
    if (etapeTypeIdSlug !== etapeTypeId) {
      // mettre à jour l'id de l'étape et les ids de ses enfants
      const etapeIdUpdated = etapeIdUpdate(etape)
      console.log(etapeIdUpdated)

      // si l'étape est liée depuis la table titres
      const titreRelatedProps = titreRelatedPropsFind(etape.id)
      console.log(titreRelatedProps)
      // supprime les liens depuis la table titres

      // supprimer l'ancienne étape et ses enfants
      // ajouter la nouvelle étape et ses enfants

      // recréé les liens depuis la table titres vers la nouvelle etapeId
    }

    const res = await titreEtapeUpsert(etape)
    await titreEtapeUpdateTasks(etape.id)

    return res
  } else {
    throw new Error(errors.join(', '))
  }
}

//
const etapeIdUpdate = etape => {
  // const props = [
  //   'substances',
  //   'points',
  //   'titulaires',
  //   'amodiataires',
  //   'administrations',
  //   'documents',
  //   'communes',
  //   'emprises'
  // ]

  return etape
}

const titreRelatedPropsFind = titreEtapeId => {
  // const props = [
  //   'substances',
  //   'points',
  //   'titulaires',
  //   'amodiataires',
  //   'administrations',
  //   'communes'
  // ]
  return []
}

export {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier,
  titreEtapeModifier
}
