import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'
import auth from './_auth'
import { titreIsPublicTest } from './_restrictions'

import formatBuild from './_format'
import eagerBuild from './_eager'
import { titreEagerFormat } from './_eager-titres'

import {
  titreGet,
  titresGet,
  titreAdd,
  titreDelete,
  titreUpdate
} from '../../database/queries/titres'

import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreUpdateTask from '../../business/titre-update'

import titreUpdateValidation from '../../business/titre-update-validation'

const titreRestrictions = titre => {
  titre.activites = []
  titre.activitesAbsentes = null
  titre.activitesDeposees = null
  titre.activitesEnConstruction = null
  if (titre.demarches) {
    titre.demarches.forEach(td => {
      if (td.etapes) {
        td.etapes.forEach(te => {
          if (te.documents) {
            te.documents = te.documents.filter(ed => ed.public)
          }

          if (te.visas) {
            delete te.visas
          }
        })
      }
    })
  }

  return titre
}

const titrePermissionsCheck = (user, titre) => {
  const userHasAccess = user && auth(user, titre, ['admin', 'super', 'editeur'])

  // Si l'utilisateur est authentifié et qu'il a un droit d'accès supérieur
  // alors il peut voir n'importe quel titre
  if (userHasAccess) {
    return titre
  }

  const titreIsPublic = titreIsPublicTest(titre)

  // Sinon, que l'utilisateur soit authentifié ou non
  // on vérifie si le titre est public
  if (titreIsPublic) {
    return titreRestrictions(titre)
  }

  return null
}

const titre = async ({ id }, context, info) => {
  const titre = await titreGet(id, {
    eager: eagerBuild(info, titreEagerFormat),
    format: formatBuild(info)
  })

  if (!titre) return null

  const user = context.user && (await utilisateurGet(context.user.id))

  return titrePermissionsCheck(user, titre)
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
  const titres = await titresGet(
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
    { eager: eagerBuild(info, titreEagerFormat), format: formatBuild(info) }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  return titres.filter(titre => titrePermissionsCheck(user, titre))
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

  try {
    await titreUpdate(titre.id, titre)

    const titreNew = await titreUpdateTask(titre.id)

    return titreNew
  } catch (e) {
    console.log('coucou')
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titre, titres, titreAjouter, titreSupprimer, titreModifier }
