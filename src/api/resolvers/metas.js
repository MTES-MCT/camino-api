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
  unitesGet
} from '../../database/queries/metas'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import { permissionsCheck } from './_permissions-check'
import { typePermissionCheck, domainePermissionCheck } from './_metas'

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

    if (!context.user) {
      return domaines.filter(
        domaine => !restrictions.domaines.find(d => d.domaineId === domaine.id)
      )
    }

    if (permissionsCheck(context.user, ['super'])) {
      domaines.forEach(d => {
        d.editable = true

        if (d.types) {
          d.types.forEach(t => {
            t.editable = true
          })
        }
      })

      return domaines
    } else if (permissionsCheck(context.user, ['admin'])) {
      const user = await utilisateurGet(context.user.id)

      domaines.forEach(domaine => {
        domaine.editable = domainePermissionCheck(domaine, user)
      })
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
  version
}
