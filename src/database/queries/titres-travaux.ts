import { Transaction } from 'objection'

import { ITitreTravaux, IFields, IUtilisateur } from '../../types'

import options from './_options'
import { fieldsFormat } from './graph/fields-format'
import graphBuild from './graph/build'
import { fieldsTitreAdd } from './graph/fields-add'

import TitresTravaux from '../models/titres-travaux'
import { titresTravauxQueryModify } from './permissions/titres-travaux'

const titresTravauxQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'travaux', fieldsFormat)
    : options.titresTravaux.graph

  const q = TitresTravaux.query().withGraphFetched(graph)

  titresTravauxQueryModify(q, user)

  return q
}

const titresTravauxGet = async (
  {
    titresTravauxIds
  }: {
    titresTravauxIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = titresTravauxQueryBuild({ fields }, user)

  if (titresTravauxIds) {
    q.whereIn('titresTravaux.id', titresTravauxIds)
  }

  return q
}

const titresTravauGet = async (
  titreTravauxId: string,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = titresTravauxQueryBuild({ fields }, user)

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
