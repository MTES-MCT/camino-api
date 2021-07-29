import { ITitrePoint, ITitrePointReference } from '../../types'

import options from './_options'

import TitresPoints from '../models/titres-points'
import TitresPointsReferences from '../models/titres-points-references'

const titresPointsGet = async () =>
  TitresPoints.query().withGraphFetched(options.points.graph)

const titrePointUpdate = async (id: string, titrePoint: Partial<ITitrePoint>) =>
  TitresPoints.query().patchAndFetchById(id, { ...titrePoint, id })

const titrePointReferenceCreate = async (
  titrePointReference: ITitrePointReference
) => TitresPointsReferences.query().insert(titrePointReference)

const titrePointReferenceUpdate = async (
  id: string,
  titrePointReference: Partial<ITitrePointReference>
) =>
  TitresPointsReferences.query().patchAndFetchById(id, {
    ...titrePointReference,
    id
  })

export {
  titresPointsGet,
  titrePointUpdate,
  titrePointReferenceCreate,
  titrePointReferenceUpdate
}
