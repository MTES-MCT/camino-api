const { dedup, findup } = require('../../utils')

const geothermieTitulaires = require('../../sources/titres/geothermie-titulaires.json')
const geothermieTitresTitulaires = require('../../sources/titres/geothermie-titres-titulaires.json')

const hydrocarburesTitulaires = require('../../sources/titres/hydrocarbures-titulaires.json')
const hydrocarburesTitresTitulaires = require('../../sources/titres/hydrocarbures-titres-titulaires.json')

const titulaires = dedup(geothermieTitulaires, hydrocarburesTitulaires)
const titresTitulaires = [
  ...geothermieTitresTitulaires,
  ...findup(hydrocarburesTitresTitulaires, 'titulaireId', 'titreId')
]

exports.seed = (knex, Promise) =>
  Promise.all([knex('titulaires').del(), knex('titresTitulaires').del()])
    .then(() => knex('titulaires').insert(titulaires))
    .then(() => knex('titresTitulaires').insert(titresTitulaires))
