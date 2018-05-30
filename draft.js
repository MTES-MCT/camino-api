const { geojson } = require('./postgres/queries/geojson')

const draft = async ({ id }) => geojson(id)

module.exports = draft
