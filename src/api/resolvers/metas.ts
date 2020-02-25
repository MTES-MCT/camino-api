import { IToken, IDomaine } from '../../types'
import { debug } from '../../config/index'

import { autorisations } from '../../database/cache/autorisations'

import {
  demarchesTypesGet,
  demarchesStatutsGet,
  documentsTypesGet,
  domainesGet,
  devisesGet,
  etapesTypesGet,
  geoSystemesGet,
  permissionsGet,
  permissionGet,
  referencesTypesGet,
  titresStatutsGet,
  titresTypesTypesGet,
  unitesGet,
  activitesTypesGet
} from '../../database/queries/metas'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import { permissionsCheck } from './permissions/permissions-check'
import {
  domainePermissionAdministrationCheck,
  titreTypePermissionAdministrationCheck
} from './permissions/titre-edition'

const npmPackage = require('../../../package.json')

const devises = async () => devisesGet()
const geoSystemes = async () => geoSystemesGet()
const unites = async () => unitesGet()
const documentsTypes = async () => documentsTypesGet()
const referencesTypes = async () => referencesTypesGet()
const permission = async ({ id }: { id: string }) => permissionGet(id)

const permissions = async (_: unknown, context: IToken) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))
    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      return null
    }

    return permissionsGet({
      ordreMax: user.permission.ordre ? user.permission.ordre : 0
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaines = async (_: unknown, context: IToken) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))
    const domaines = await domainesGet()

    if (!permissionsCheck(user, ['super', 'admin'])) {
      return domaines.filter(domaine =>
        autorisations.domaines.find(
          d => d.domaineId === domaine.id && d.publicLecture
        )
      )
    }

    return domaines
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurDomaines = async (_: unknown, context: IToken) => {
  try {
    if (!context.user) return []

    const user = await utilisateurGet(context.user.id)

    const isSuper = permissionsCheck(user, ['super'])
    const isAdmin = permissionsCheck(user, ['admin'])

    if (!isSuper && !isAdmin) return []

    let domaines = (await domainesGet()) as IDomaine[]

    if (isAdmin) {
      domaines = domaines.reduce((domaines: IDomaine[], domaine) => {
        const editable = domainePermissionAdministrationCheck(user, domaine.id)

        if (editable) {
          if (domaine.titresTypes) {
            domaine.titresTypes = domaine.titresTypes.filter(tt =>
              titreTypePermissionAdministrationCheck(user, tt.id)
            )
          }

          domaines.push(domaine)
        }

        return domaines
      }, [])
    }

    return domaines
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const types = async () => {
  try {
    const types = await titresTypesTypesGet()

    return types
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const statuts = async (_: unknown, context: IToken) => {
  try {
    let statuts = await titresStatutsGet()

    if (!context.user) {
      statuts = statuts.filter(statut =>
        autorisations.statutIds.includes(statut.id)
      )
    }

    return statuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarchesTypes = async () => {
  try {
    const demarchesTypes = await demarchesTypesGet()

    return demarchesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarchesStatuts = async () => {
  try {
    const demarchesStatuts = await demarchesStatutsGet()

    return demarchesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapesTypes = async () => {
  try {
    const etapesTypes = await etapesTypesGet()

    return etapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const version = () => {
  return npmPackage.version
}

const activitesTypes = async () => {
  try {
    const activitesTypes = await activitesTypesGet()

    // TODO: ne retourner que les types d'activités auxquels l'utilisateur a accès

    return activitesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  devises,
  demarchesTypes,
  demarchesStatuts,
  documentsTypes,
  domaines,
  etapesTypes,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version,
  utilisateurDomaines,
  activitesTypes
}
