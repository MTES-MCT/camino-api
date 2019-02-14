import permissionsCheck from './_permissions-check'
import { titreFormat } from './_format'
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

import titreEtapeUpdateTasks from '../../tasks/etape-update/index'

const titre = async ({ id }, context, info) => {
  const titre = await titreGet(id)

  const userEntreprisePermissions = async (userId, titreEntrepriseIds) => {
    const utilisateur = await utilisateurGet(userId)
    const entrepriseId = utilisateur.entreprise && utilisateur.entreprise.id
    return titreEntrepriseIds.some(id => id === entrepriseId)
  }

  return (!restrictedDomaineIds.includes(titre.domaineId) &&
    !restrictedStatutIds.includes(titre.statutId)) ||
    (context.user &&
      (permissionsCheck(context.user, ['admin', 'super']) ||
        (await userEntreprisePermissions(context.user.id, [
          ...titre.titulaires.map(t => t.id),
          ...titre.amodiataires.map(t => t.id)
        ]))))
    ? titre && titreFormat(titre)
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

  const userEntrepriseTitresFind = async (
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
    const utilisateur = await utilisateurGet(userId)
    const entrepriseId =
      utilisateur && utilisateur.entreprise && utilisateur.entreprise.id

    if (entrepriseId) {
      // si le filtre `entreprise est renseigné,
      // on en peut pas savoir si `entreprises` renvoie la même liste que `[entrepriseId]`
      // donc on fait une requête pour chaque
      // et on ne garde que les éléments présent dans les deux
      const entrepriseTitres =
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

      const userEntrepriseTitres = await titresGet({
        typeIds,
        domaineIds,
        statutIds,
        substances,
        noms,
        entreprises: [entrepriseId],
        references,
        territoires
      })

      return entreprises
        ? dupFind('id', entrepriseTitres, userEntrepriseTitres)
        : userEntrepriseTitres
    }

    return []
  }

  const userEntrepriseTitres =
    context.user && permissionsCheck(context.user, ['entreprise'])
      ? await userEntrepriseTitresFind(context.user.id, {
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

  const titres = await titresGet({
    typeIds,
    domaineIds:
      context.user && permissionsCheck(context.user, ['admin', 'super'])
        ? domaineIds
        : await domaineIdsRestrict(domaineIds),
    statutIds:
      context.user && permissionsCheck(context.user, ['admin', 'super'])
        ? statutIds
        : await statutIdsRestrict(statutIds),
    substances,
    noms,
    entreprises,
    references,
    territoires
  })

  const titresList = dupRemove('id', titres, userEntrepriseTitres)

  return titresList.map(titre => titre && titreFormat(titre))
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
  const props = [
    'substances',
    'points',
    'titulaires',
    'amodiataires',
    'administrations',
    'documents',
    'communes',
    'emprises'
  ]

  return etape
}

const titreRelatedPropsFind = titreEtapeId => {
  const props = [
    'substances',
    'points',
    'titulaires',
    'amodiataires',
    'administrations',
    'communes'
  ]
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
