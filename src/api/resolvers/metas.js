import { debug } from '../../config/index'

import restrictions from './_restrictions'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'

import {
  documentsTypesGet,
  domainesGet,
  devisesGet,
  geoSystemesGet,
  permissionsGet,
  permissionGet,
  referencesTypesGet,
  statutsGet,
  typesGet,
  unitesGet,
  activitesTypesGet
} from '../../database/queries/metas'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import { permissionsCheck } from './permissions/permissions-check'
import {
  typePermissionCheck,
  domainePermissionCheck
} from './permissions/metas'

const npmPackage = require('../../../package.json')

const devises = async (_, context) => devisesGet()
const geoSystemes = async (_, context) => geoSystemesGet()
const unites = async (_, context) => unitesGet()
const documentsTypes = async (_, context) => documentsTypesGet()
const referencesTypes = async (_, context) => referencesTypesGet()
const permission = async ({ id }, context) => permissionGet(id)

const permissions = async (_, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      return null
    }

    return permissionsGet({
      ordreMax: context.user ? context.user.permissionOrdre : null
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaines = async (variables, context, info) => {
  try {
    const domaines = await domainesGet()

    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      return domaines.filter(
        domaine => !restrictions.domaines.find(d => d.domaineId === domaine.id)
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

const utilisateurDomaines = async (variables, context, info) => {
  try {
    if (!context.user) return []

    let domaines = await domainesGet()

    const isSuper = permissionsCheck(context.user, ['super'])
    const isAdmin = permissionsCheck(context.user, ['admin'])

    if (!isSuper && !isAdmin) return []

    if (isAdmin) {
      const user = await utilisateurGet(context.user.id)

      domaines = domaines.reduce((domaines, domaine) => {
        const editable = domainePermissionCheck(domaine, user)

        if (editable) {
          if (domaine.types) {
            domaine.types = domaine.types.filter(t =>
              typePermissionCheck(t.id, user)
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

const types = async (variables, context, info) => {
  try {
    const fields = fieldsBuild(info)
    const typesEager = eagerBuild(fields, 'types')
    const types = await typesGet({ eager: typesEager })

    if (permissionsCheck(context.user, ['super'])) {
      types.forEach(d => {
        d.editable = true
      })

      return types
    } else if (permissionsCheck(context.user, ['admin'])) {
      const user = await utilisateurGet(context.user.id)

      types.forEach(type => {
        type.editable = typePermissionCheck(type.id, user)
      })
    }

    return types
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const statuts = async (variables, context, info) => {
  try {
    let statuts = await statutsGet()

    if (!context.user) {
      statuts = statuts.filter(
        statut => !restrictions.statutIds.find(d => d === statut.id)
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

const version = (variables, context, info) => {
  return npmPackage.version
}

const activitesTypes = async (variables, context, info) => {
  try {
    const activitesTypes = await activitesTypesGet()

    if (!permissionsCheck(context.user, ['super'])) {
      throw new Error('droits insuffisants')
    }

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
  documentsTypes,
  domaines,
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
