import { ITitreTravaux, IFields, IUtilisateur } from '../../types'
import { Transaction } from 'objection'

import TitresTravaux from '../models/titres-travaux'
import options from './_options'
import { fieldsFormat } from './graph/fields-format'
import graphBuild from './graph/build'
import { fieldsTitreAdd } from './graph/fields-add'
import { titresTravauxQueryModify } from './permissions/titres-travaux'

const titresTravauxQueryBuild = (
  _: never,
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'travaux', fieldsFormat)
    : options.titresTravaux.graph

  const q = TitresTravaux.query().withGraphFetched(graph)

  titresTravauxQueryModify(q, fields, user)

  return q
}

const titresTravauxGet = async (
  {
    titresTravauxIds
  }: {
    titresTravauxIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const q = titresTravauxQueryBuild(null as never, { fields }, user)

  if (titresTravauxIds) {
    q.whereIn('titresTravaux.id', titresTravauxIds)
  }

  return q
}

const titresTravauGet = async (
  titreTravauxId: string,
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const q = titresTravauxQueryBuild(null as never, { fields }, user)

  return q.findById(titreTravauxId)
}

const titreTravauxCreate = async (titreTravaux: ITitreTravaux) =>
  TitresTravaux.query().insertAndFetch(titreTravaux)

const titreTravauxUpdate = async (
  id: string,
  titreTravaux: Partial<ITitreTravaux>
) => TitresTravaux.query().patch(titreTravaux).findById(id)

const titreTravauxDelete = async (id: string, trx?: Transaction) =>
  TitresTravaux.query(trx)
    .deleteById(id)
    .withGraphFetched(options.titresTravaux.graph)
    .returning('*')

export {
  titresTravauGet,
  titresTravauxGet,
  titreTravauxCreate,
  titreTravauxUpdate,
  titreTravauxDelete
}
