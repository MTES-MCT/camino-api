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

import { dedup } from '../../tools/index'

const titreEtapeUpdateTasks = require('../../tasks/etape-update/index')

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
  { typeIds, domaineIds, statutIds, substances, noms, entreprises, references },
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

  const entrepriseTitresFind = async (userId, domaineIds, statutIds) => {
    const utilisateur = await utilisateurGet(userId)
    const entrepriseId = utilisateur.entreprise && utilisateur.entreprise.id

    if (entrepriseId) {
      const entrepriseTitres = await titresGet({
        typeIds: null,
        domaineIds,
        statutIds,
        substances: null,
        noms: null,
        entreprises: [entrepriseId],
        references: null
      })

      return entrepriseTitres
    }

    return []
  }

  const entrepriseTitres =
    context.user && permissionsCheck(context.user, ['entreprise'])
      ? await entrepriseTitresFind(context.user.id, domaineIds, statutIds)
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
    references
  })

  const titresList = dedup('id', titres, entrepriseTitres)

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
      // supprimer l'ancienne étape et ses enfants
      // ajouter la nouvelle étape et ses enfants
    }

    const res = await titreEtapeUpsert(etape)
    await titreEtapeUpdateTasks(etape)

    return res
  } else {
    throw new Error(errors.join(', '))
  }
}

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

export {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier,
  titreEtapeModifier
}
