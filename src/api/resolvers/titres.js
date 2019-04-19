import permissionsCheck from './_permissions-check'
import { restrictedDomaineIds, restrictedStatutIds } from './_restrictions'

import {
  titreGet,
  titresGet,
  titreAdd,
  titreRemove,
  titreUpdate
} from '../../database/queries/titres'

import { domainesGet, statutsGet } from '../../database/queries/metas'
import {
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'
import { utilisateurGet } from '../../database/queries/utilisateurs'
import { dupRemove, dupFind } from '../../tools/index'
import titreEtapeUpdateTask from '../../tasks/titre-etape-update'

import titreEtapeUpdateValidation from '../../tasks/titre-etape-validation'

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
    permissionsCheck(user, ['admin', 'super', 'editeur']) ||
    userEntreprisePermissionsGet(user.id, titreEntrepriseIds)

  const userHasAccess =
    context.user &&
    (await userHasAccessTest(
      context.user,
      titreEntrepriseIdsGet(titre.titulaires, titre.amodiataires)
    ))

  const titreIsPublic = titreIsPublicTest(titre.domaineId, titre.statutId)

  return titreIsPublic || userHasAccess
    ? titreRestrictions(titre, userHasAccess)
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
    context.user &&
    permissionsCheck(context.user, ['admin', 'super', 'editeur'])

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

  return titres
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

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  return titreRemove(id)
}

const titreModifier = async ({ titre }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  return titreUpdate(titre)
}

const titreEtapeModifier = async ({ etape }, context, info) => {
  const errors = []
  const propsMandatory = ['date', 'typeId', 'statutId']

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  propsMandatory.forEach(p => {
    if (!etape[p]) {
      errors.push(`le champ ${p} est requis`)
    }
  })

  const rulesError = await titreEtapeUpdateValidation(etape)

  if (rulesError) {
    errors.push(rulesError)
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const joinTables = [
    'titulaires',
    'amodiataires',
    'administrations',
    'substances',
    'emprises'
  ]

  joinTables.forEach(props => {
    const propsIds = `${props}Ids`
    if (etape[propsIds]) {
      etape[props] = etape[propsIds].map(id => ({ id }))

      delete etape[propsIds]
    }
  })

  const res = await titreEtapeUpsert(etape)

  await titreEtapeUpdateTask(etape.id)

  return res
}

const titreEtapeSupprimer = async ({ etapeId }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const res = await titreEtapeDelete(etapeId)

  return res
}

export {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier,
  titreEtapeModifier,
  titreEtapeSupprimer
}
