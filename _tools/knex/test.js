require('dotenv').config()
// const Knex = require('knex')
// const { env } = require('../../conf')
// const knexConf = require('../../conf/knex')[env]
// const knex = Knex(knexConf)

const TitresGeoPoints = require('../../postgres/models/titres-geo-points')

const id = 'c-cxx-oct-astrolabe-contour-00-000'

const full = {
  id: 'c-cxx-oct-astrolabe-contour-00-000',
  titrePhaseId: 'c-cxx-oct-astrolabe',
  coordonees: { x: -2.72388889059711, y: 47.0463888889241 },
  groupe: 'contour-00',
  position: 0,
  nom: '0',
  reference: null,
  referenceValeur: [-2.72388889059711, 47.0463888889241]
}

// knex('titresGeoPoints')
//   .where({ id })
//   .then(rows => console.log(rows[0].coordonees))

TitresGeoPoints.query()
  .findById(id)
  .then(r => console.log(r))

// TitresGeoPoints.query()
//   .findById(id)
//   .upsertGraph([full])
//   .first()
//   .then(r => console.log(r))
