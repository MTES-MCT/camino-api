import TitresPoints from '../models/titres-points'
import TitresPointsReferences from '../models/titres-points-references'
import options from './_options'

const titresPointsGet = async () =>
  TitresPoints.query().withGraphFetched(options.points.graph)

const titrePointUpdate = async (id, props) =>
  TitresPoints.query()
    .withGraphFetched(options.points.graph)
    .patchAndFetchById(id, props)

const titrePointReferenceCreate = async titrePointReference =>
  TitresPointsReferences.query().insertAndFetch(titrePointReference)

export { titresPointsGet, titrePointUpdate, titrePointReferenceCreate }
