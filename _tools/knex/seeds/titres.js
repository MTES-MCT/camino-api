const geothermie = require('../../sources/titres/geothermie-titres.json')
const geothermiePhases = require('../../sources/titres/geothermie-titres-phases.json')
const geothermiePhasesEmprises = require('../../sources/titres/geothermie-titres-phases-emprises.json')
const geothermieSubstancesPrincipales = require('../../sources/titres/geothermie-titres-substances-principales.json')

const titres = [].concat(geothermie)
const titresPhases = [].concat(geothermiePhases)
const titresPhasesEmprises = [].concat(geothermiePhasesEmprises)
const titresSubstancesPrincipales = [].concat(geothermieSubstancesPrincipales)

exports.seed = (knex, Promise) => {
  return Promise.all([
    knex('titres').del(),
    knex('titresPhases').del(),
    knex('titresPhasesEmprises').del(),
    knex('titresSubstancesPrincipales').del()
  ])
    .then(() => {
      return knex('titres').insert(titres)
    })
    .then(() => {
      return Promise.all([
        knex('titresPhases').insert(titresPhases),
        knex('titresSubstancesPrincipales').insert(titresSubstancesPrincipales)
      ])
    })
    .then(() => {
      knex('titresPhasesEmprises').insert(titresPhasesEmprises)
    })
}
