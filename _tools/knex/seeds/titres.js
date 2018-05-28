const geothermie = require('../../sources/titres/geothermie-titres.json')
const geothermiePhases = require('../../sources/titres/geothermie-titres-phases.json')
const geothermiePhasesEmprises = require('../../sources/titres/geothermie-titres-phases-emprises.json')
const geothermieSubstancesPrincipales = require('../../sources/titres/geothermie-titres-substances-principales.json')
const geothermieGeoPoints = require('../../sources/titres/geothermie-titres-geo-points.json')

const titres = [].concat(geothermie)
const titresPhases = [].concat(geothermiePhases)
const titresPhasesEmprises = [].concat(geothermiePhasesEmprises)
const titresSubstancesPrincipales = [].concat(geothermieSubstancesPrincipales)
const titresGeoPoints = [].concat(geothermieGeoPoints)

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titres').del(),
    knex('titresPhases').del(),
    knex('titresPhasesEmprises').del(),
    knex('titresSubstancesPrincipales').del()
  ])
    .then(() => knex('titres').insert(titres))
    .then(() =>
      Promise.all([
        knex('titresPhases').insert(titresPhases),
        knex('titresSubstancesPrincipales').insert(titresSubstancesPrincipales)
      ])
    )
    .then(() =>
      Promise.all([
        knex('titresPhasesEmprises').insert(titresPhasesEmprises),
        knex('titresGeoPoints').insert(titresGeoPoints)
      ])
    )
