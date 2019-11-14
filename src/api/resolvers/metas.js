import { debug } from '../../config/index'

import restrictions from './_restrictions'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'

import {
  typesGet,
  domainesGet,
  statutsGet,
  devisesGet,
  geoSystemesGet,
  unitesGet,
  documentsTypesGet,
  referencesTypesGet,
  permissionGet,
  permissionsGet
} from '../../database/queries/metas'

import { permissionsCheck } from './_permissions-check'

const npmPackage = require('../../../package.json')

const devises = async (_, context) => devisesGet()
const geoSystemes = async (_, context) => geoSystemesGet()
const unites = async (_, context) => unitesGet()
const documentsTypes = async (_, context) => documentsTypesGet()
const referencesTypes = async (_, context) => referencesTypesGet()
const permission = async ({ id }, context) => permissionGet(id)

const permissions = async (_, context) => {
  try {
    if (permissionsCheck(context.user, ['super', 'admin'])) {
      return permissionsGet({
        ordreMax: context.user ? context.user.permissionOrdre : null
      })
    }

    return null
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaines = async (variables, context, info) => {
  try {
    let domaines = await domainesGet()
    if (!context.user) {
      domaines = domaines.filter(
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

const types = async (variables, context, info) => {
  try {
    const fields = fieldsBuild(info)
    const typesEager = eagerBuild(fields, 'types')
    const types = await typesGet({ eager: typesEager })

    return types
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
