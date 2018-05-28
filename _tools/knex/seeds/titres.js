const geothermie = require('../../sources/titres/geothermie-titres.json')
const geothermiePhases = require('../../sources/titres/geothermie-titres-phases.json')
const geothermiePhasesEmprises = require('../../sources/titres/geothermie-titres-phases-emprises.json')
const geothermieSubstancesPrincipales = require('../../sources/titres/geothermie-titres-substances-principales.json')
const geothermieGeoPoints = require('../../sources/titres/geothermie-titres-geo-points.json')

const hydrocarbures = require('../../sources/titres/hydrocarbures-titres.json')
const hydrocarburesPhases = require('../../sources/titres/hydrocarbures-titres-phases.json')
const hydrocarburesPhasesEmprises = require('../../sources/titres/hydrocarbures-titres-phases-emprises.json')
const hydrocarburesSubstancesPrincipales = require('../../sources/titres/hydrocarbures-titres-substances-principales.json')
const hydrocarburesGeoPoints = require('../../sources/titres/hydrocarbures-titres-geo-points.json')

const titres = [...geothermie, ...hydrocarbures]
const titresPhases = [...geothermiePhases, ...hydrocarburesPhases]
const titresPhasesEmprises = [
  ...geothermiePhasesEmprises,
  ...hydrocarburesPhasesEmprises
]
const titresSubstancesPrincipales = [
  ...geothermieSubstancesPrincipales,
  ...hydrocarburesSubstancesPrincipales
]
const titresGeoPoints = [...geothermieGeoPoints, ...hydrocarburesGeoPoints]

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
