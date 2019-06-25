import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'
import auth from './_auth'
import { titreIsPublicTest } from './_restrictions'

// import fileCreate from '../../tools/file-create'
import titreEagerBuild from './_eager'

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
  const titre = await titreGet(id, { eager: titreEagerBuild(info) })

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
    { eager: titreEagerBuild(info) }
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
    const res = await titreUpsert(titre)

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
