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

const titreEtapeUpdateTasks = require('../../tasks/etape-update/index')

const titre = async ({ id }, context, info) => {
  let titre = await titreGet(id)

  if (
    titre &&
    (!context.user || permissionsCheck(context.user, ['defaut', 'entreprise']))
  ) {
    if (
      restrictedDomaineIds.includes(titre.domaineId) ||
      restrictedStatutIds.includes(titre.statutId)
    ) {
      titre = null
    }
  }

  return titre && titreFormat(titre)
}

const titres = async (
  { typeIds, domaineIds, statutIds, substances, noms, entreprises, references },
  context,
  info
) => {
  if (
    !context.user ||
    permissionsCheck(context.user, ['defaut', 'entreprise'])
  ) {
    if (!domaineIds) {
      let domaines = await domainesGet()
      domaineIds = domaines.map(domaine => domaine.id)
    }
    domaineIds = domaineIds.filter(id => !restrictedDomaineIds.includes(id))

    if (!statutIds) {
      let statuts = await statutsGet()
      statutIds = statuts.map(statut => statut.id)
    }

    statutIds = statutIds.filter(id => !restrictedStatutIds.includes(id))
  }

  const titres = await titresGet({
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references
  })

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
