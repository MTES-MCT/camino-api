import { ITitresPoints, ITitresPointsReferences } from '../../types'

import TitresPoints from '../models/titres-points'
import TitresPointsReferences from '../models/titres-points-references'
import options from './_options'

const titresPointsGet = async () =>
  TitresPoints.query().withGraphFetched(options.points.graph)

const titrePointUpdate = async (id: string, props: ITitresPoints) =>
  TitresPoints.query()
    .withGraphFetched(options.points.graph)
    .patchAndFetchById(id, props)

const titrePointReferenceCreate = async (
  titrePointReference: ITitresPointsReferences
) => TitresPointsReferences.query().insertAndFetch(titrePointReference)

export { titresPointsGet, titrePointUpdate, titrePointReferenceCreate }
