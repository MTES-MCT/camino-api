const TitresPoints = require('../models/titres-points')

const titresPointsGet = async () => TitresPoints.query()

const titrePointUpdate = async ({ id, groupe, contour, point }) =>
  TitresPoints.query()
    .skipUndefined()
    .findById(id)
    .patch({ id, groupe, contour, point })

module.exports = {
  titresPointsGet,
  titrePointUpdate
}
