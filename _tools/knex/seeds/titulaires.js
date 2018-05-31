const { dedup, findup } = require('../../utils')

const gTitulaires = require('../../sources/titres/g-titulaires.json')
const gTitresTitulaires = require('../../sources/titres/g-titres-titulaires.json')

const hTitulaires = require('../../sources/titres/h-titulaires.json')
const hTitresTitulaires = require('../../sources/titres/h-titres-titulaires.json')

const mTitulaires = require('../../sources/titres/m-titulaires.json')
const mTitresTitulaires = require('../../sources/titres/m-titres-titulaires.json')

const sTitulaires = require('../../sources/titres/s-titulaires.json')
const sTitresTitulaires = require('../../sources/titres/s-titres-titulaires.json')

const cTitulaires = require('../../sources/titres/c-titulaires.json')
const cTitresTitulaires = require('../../sources/titres/c-titres-titulaires.json')

const m973Titulaires = require('../../sources/titres/m973-titulaires.json')
const m973TitresTitulaires = require('../../sources/titres/m973-titres-titulaires.json')

const titulaires = dedup(
  gTitulaires,
  hTitulaires,
  mTitulaires,
  sTitulaires,
  cTitulaires,
  m973Titulaires
)

const titresTitulaires = [
  ...gTitresTitulaires,
  ...findup(hTitresTitulaires, 'titulaireId', 'titreId'),
  ...mTitresTitulaires,
  ...sTitresTitulaires,
  ...cTitresTitulaires,
  ...m973TitresTitulaires
]

exports.seed = (knex, Promise) =>
  Promise.all([knex('titulaires').del(), knex('titresTitulaires').del()])
    .then(() => knex('titulaires').insert(titulaires))
    .then(() => knex('titresTitulaires').insert(titresTitulaires))
