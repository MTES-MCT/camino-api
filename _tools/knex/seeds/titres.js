const g = require('../../sources/titres/g-titres.json')
const gPhases = require('../../sources/titres/g-titres-phases.json')
const gPhasesEmprises = require('../../sources/titres/g-titres-phases-emprises.json')
const gSubstancesPrincipales = require('../../sources/titres/g-titres-substances-principales.json')
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
const mSubstancesConnexes = require('../../sources/titres/m-titres-substances-connexes.json')
const mGeoPoints = require('../../sources/titres/m-titres-geo-points.json')

const s = require('../../sources/titres/s-titres.json')
const sPhases = require('../../sources/titres/s-titres-phases.json')
const sPhasesEmprises = require('../../sources/titres/s-titres-phases-emprises.json')
const sSubstancesPrincipales = require('../../sources/titres/s-titres-substances-principales.json')
const sGeoPoints = require('../../sources/titres/s-titres-geo-points.json')

const c = require('../../sources/titres/c-titres.json')
const cPhases = require('../../sources/titres/c-titres-phases.json')
const cPhasesEmprises = require('../../sources/titres/c-titres-phases-emprises.json')
const cSubstancesPrincipales = require('../../sources/titres/c-titres-substances-principales.json')
const cGeoPoints = require('../../sources/titres/c-titres-geo-points.json')

const m973 = require('../../sources/titres/m973-titres.json')
const m973Phases = require('../../sources/titres/m973-titres-phases.json')
const m973PhasesEmprises = require('../../sources/titres/m973-titres-phases-emprises.json')
const m973SubstancesPrincipales = require('../../sources/titres/m973-titres-substances-principales.json')
const m973SubstancesConnexes = require('../../sources/titres/m973-titres-substances-connexes.json')
const m973GeoPoints = require('../../sources/titres/m973-titres-geo-points.json')

const titres = [...g, ...h, ...m, ...s, ...c, ...m973]
const titresPhases = [
  ...gPhases,
  ...hPhases,
  ...mPhases,
  ...sPhases,
  ...cPhases,
  ...m973Phases
]
const titresPhasesEmprises = [
  ...gPhasesEmprises,
  ...hPhasesEmprises,
  ...mPhasesEmprises,
  ...sPhasesEmprises,
  ...cPhasesEmprises,
  ...m973PhasesEmprises
]
const titresSubstancesPrincipales = [
  ...gSubstancesPrincipales,
  ...hSubstancesPrincipales,
  ...mSubstancesPrincipales,
  ...sSubstancesPrincipales,
  ...cSubstancesPrincipales,
  ...m973SubstancesPrincipales
]
const titresSubstancesConnexes = [
  ...mSubstancesConnexes,
  ...m973SubstancesConnexes
]

const titresGeoPoints = [
  ...gGeoPoints,
  ...hGeoPoints,
  ...mGeoPoints,
  ...sGeoPoints,
  ...cGeoPoints,
  ...m973GeoPoints
]

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titres').del(),
    knex('titresPhases').del(),
    knex('titresPhasesEmprises').del(),
    knex('titresSubstancesPrincipales').del(),
    knex('titresSubstancesConnexes').del(),
    knex('titresGeoPoints').del()
  ])
    .then(() => knex('titres').insert(titres))
    .then(() =>
      Promise.all([
        knex('titresPhases').insert(titresPhases),
        knex('titresSubstancesPrincipales').insert(titresSubstancesPrincipales),
        knex('titresSubstancesConnexes').insert(titresSubstancesConnexes)
      ])
    )
    .then(() =>
      Promise.all([
        knex('titresPhasesEmprises').insert(titresPhasesEmprises),
        knex('titresGeoPoints').insert(titresGeoPoints)
      ])
    )
