const Titres = require('../models/titres')
const TitresGeoPoints = require('../models/titres-geo-points')
const { hasPermission } = require('../../auth/permissions')
const titresOptions = require('./_titres-options')

const queries = {
  geojson: async (id, user) => {
    const titre = await Titres.query()
      .findById(id)
      .eager(titresOptions.eager)
      .first()

    // titre.phases.forEach(p => {
    //   p.geojson = {
    //     type: 'FeatureCollection',
    //     features: geojsonFeatures(p.points)
    //   }
    // })

    return titre
  }
}

module.exports = queries
