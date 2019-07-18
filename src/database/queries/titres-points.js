import TitresPoints from '../models/titres-points'

const titresPointsGet = async () => TitresPoints.query()

const titrePointUpdate = async (id, props) =>
  TitresPoints.query().patchAndFetchById(id, props)

export { titresPointsGet, titrePointUpdate }
