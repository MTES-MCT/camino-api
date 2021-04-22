import { ITitrePointReference } from '../../types'

import options from './_options'

import TitresPoints from '../models/titres-points'
import TitresPointsReferences from '../models/titres-points-references'

const titresPointsGet = async () =>
  TitresPoints.query().withGraphFetched(options.points.graph)

const titrePointReferenceCreate = async (
  titrePointReference: ITitrePointReference
) => TitresPointsReferences.query().insert(titrePointReference)

export { titresPointsGet, titrePointReferenceCreate }
