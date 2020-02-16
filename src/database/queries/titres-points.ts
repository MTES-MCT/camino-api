import { ITitrePoint, ITitrePointReference } from '../../types'

import TitresPoints from '../models/titres-points'
import TitresPointsReferences from '../models/titres-points-references'
import options from './_options'

const titresPointsGet = async () =>
  TitresPoints.query().withGraphFetched(options.points.graph)

const titrePointUpdate = async (id: string, props: Partial<ITitrePoint>) =>
  TitresPoints.query()
    .withGraphFetched(options.points.graph)
    .patchAndFetchById(id, props)

const titrePointReferenceCreate = async (
  titrePointReference: ITitrePointReference
) => TitresPointsReferences.query().insertAndFetch(titrePointReference)

export { titresPointsGet, titrePointUpdate, titrePointReferenceCreate }
