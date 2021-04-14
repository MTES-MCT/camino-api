import {
  IFields,
  ITravauxType,
  ITravauxTypeTravauxEtapeType,
  IUtilisateur
} from '../../types'

import TravauxTypes from '../models/travaux-types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'

import {
  travauxTypesQueryModify,
  travauxEtapesTypesQueryModify
} from './permissions/metas-travaux'
import TravauxTypesTravauxEtapesTypes from '../models/travaux-types--travaux-etapes-types'
import TravauxEtapesTypes from '../models/travaux-etapes-types'

const travauxTypesGet = async (
  { titreId, titreTravauxId }: { titreId?: string; titreTravauxId?: string },
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'travauxTypes', fieldsFormat)
    : options.travauxTypes.graph

  const q = TravauxTypes.query().withGraphFetched(graph).orderBy('ordre')

  travauxTypesQueryModify(q, user, {
    titreId,
    titreTravauxId
  })

  return q
}

const travauxTypeUpdate = async (id: string, props: Partial<ITravauxType>) =>
  TravauxTypes.query().patchAndFetchById(id, props)

const travauxEtapeTypeGet = async (
  id: string,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fields, 'travauxEtapesTypes', fieldsFormat)
    : options.travauxEtapesTypes.graph

  return TravauxEtapesTypes.query().withGraphFetched(graph).findById(id)
}

const travauxEtapesTypesGet = async (
  { titreTravauxId }: { titreTravauxId?: string },
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'travauxEtapesTypes', fieldsFormat)
    : options.travauxEtapesTypes.graph

  const q = TravauxEtapesTypes.query().withGraphFetched(graph).orderBy('ordre')

  if (titreTravauxId) {
    travauxEtapesTypesQueryModify(q, user, {})
  }

  return q
}

const travauxTypesTravauxEtapesTypesGet = async () =>
  TravauxTypesTravauxEtapesTypes.query().orderBy([
    'travauxTypeId',
    'travauxEtapeTypeId'
  ])

const travauxTypeTravauxEtapeTypeUpdate = async (
  travauxTypeId: string,
  etapeTypeId: string,
  props: Partial<ITravauxTypeTravauxEtapeType>
) =>
  TravauxTypesTravauxEtapesTypes.query().patchAndFetchById(
    [travauxTypeId, etapeTypeId],
    props
  )

const travauxTypeTravauxEtapeTypeCreate = async (
  travauxTypeTravauxEtapeType: ITravauxTypeTravauxEtapeType
) =>
  TravauxTypesTravauxEtapesTypes.query().insertAndFetch(
    travauxTypeTravauxEtapeType
  )

const travauxTypeTravauxEtapeTypeDelete = async (
  travauxTypeId: string,
  etapeTypeId: string
) =>
  TravauxTypesTravauxEtapesTypes.query().deleteById([
    travauxTypeId,
    etapeTypeId
  ])

export {
  travauxTypesGet,
  travauxTypeUpdate,
  travauxEtapesTypesGet,
  travauxEtapeTypeGet,
  travauxTypesTravauxEtapesTypesGet,
  travauxTypeTravauxEtapeTypeUpdate,
  travauxTypeTravauxEtapeTypeCreate,
  travauxTypeTravauxEtapeTypeDelete
}
