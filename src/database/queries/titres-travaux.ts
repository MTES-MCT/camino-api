import { ITitreTravaux, IFields } from '../../types'

import TitresTravaux from '../models/titres-travaux'
import options from './_options'
import graphFormat from './graph/format'
import graphBuild from './graph/build'
import { fieldTitreAdd } from './graph/fields-add'

const titreTravauxCreate = async (
  titreTravaux: ITitreTravaux,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'travaux', graphFormat)
    : options.titresTravaux.graph

  return TitresTravaux.query()
    .insertAndFetch(titreTravaux)
    .withGraphFetched(graph)
}

const titreTravauxUpdate = async (
  id: string,
  props: Partial<ITitreTravaux>,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'travaux', graphFormat)
    : options.titresTravaux.graph

  return TitresTravaux.query()
    .patchAndFetchById(id, props)
    .withGraphFetched(graph)
}

export { titreTravauxCreate, titreTravauxUpdate }
