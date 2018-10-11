const TitresPoints = require('../models/titres-points')

const queries = {
  async titresPointsGet() {
    return TitresPoints.query()
  },

  async titrePointUpdate({ id, groupe, contour, point }) {
    return TitresPoints.query()
      .skipUndefined()
      .findById(id)
      .patch({ id, groupe, contour, point })
  }
}

module.exports = queries
