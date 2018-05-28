const g = require('../../sources/titres/g-titres.json')
const gPhases = require('../../sources/titres/g-titres-phases.json')
const gPhasesEmprises = require('../../sources/titres/g-titres-phases-emprises.json')
const gGeoPoints = require('../../sources/titres/g-titres-geo-points.json')

const h = require('../../sources/titres/h-titres.json')
const hPhases = require('../../sources/titres/h-titres-phases.json')
const hPhasesEmprises = require('../../sources/titres/h-titres-phases-emprises.json')
const hSubstancesPrincipales = require('../../sources/titres/h-titres-substances-principales.json')
const hGeoPoints = require('../../sources/titres/h-titres-geo-points.json')

const m = require('../../sources/titres/m-titres.json')
const mPhases = require('../../sources/titres/m-titres-phases.json')
const mPhasesEmprises = require('../../sources/titres/m-titres-phases-emprises.json')
const mSubstancesPrincipales = require('../../sources/titres/m-titres-substances-principales.json')
const mSubstancesSecondaires = require('../../sources/titres/m-titres-substances-secondaires.json')
const mGeoPoints = require('../../sources/titres/m-titres-geo-points.json')

const titres = [...g, ...h, ...m]
const titresPhases = [...gPhases, ...hPhases, ...mPhases]
const titresPhasesEmprises = [
  ...gPhasesEmprises,
  ...hPhasesEmprises,
  ...mPhasesEmprises
]
const titresSubstancesPrincipales = [
  ...hSubstancesPrincipales,
  ...mSubstancesPrincipales
]
const titresSubstancesSecondaires = [...mSubstancesSecondaires]
const titresGeoPoints = [...gGeoPoints, ...hGeoPoints, ...mGeoPoints]

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titres').del(),
    knex('titresPhases').del(),
    knex('titresPhasesEmprises').del(),
    knex('titresSubstancesPrincipales').del(),
    knex('titresSubstancesSecondaires').del()
  ])
    .then(() => knex('titres').insert(titres))
    .then(() =>
      Promise.all([
        knex('titresPhases').insert(titresPhases),
        knex('titresSubstancesPrincipales').insert(titresSubstancesPrincipales),
        knex('titresSubstancesSecondaires').insert(titresSubstancesSecondaires)
      ])
    )
    .then(() =>
      Promise.all([
        knex('titresPhasesEmprises').insert(titresPhasesEmprises),
        knex('titresGeoPoints').insert(titresGeoPoints)
      ])
    )
