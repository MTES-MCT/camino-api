const geothermieTitulaires = require('../../sources/titres/geothermie-titulaires.json')
const geothermieTitresTitulaires = require('../../sources/titres/geothermie-titres-titulaires.json')

const titulaires = [].concat(geothermieTitulaires)
const titresTitulaires = [].concat(geothermieTitresTitulaires)

exports.seed = (knex, Promise) =>
  Promise.all([knex('titulaires').del(), knex('titresTitulaires').del()])
    .then(() => knex('titulaires').insert(titulaires))
    .then(() => knex('titresTitulaires').insert(titresTitulaires))
