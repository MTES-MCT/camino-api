const { dedup, findup } = require('../../utils')

const gTitulaires = require('../../sources/titres/g-titulaires.json')
const gTitresTitulaires = require('../../sources/titres/g-titres-titulaires.json')

const hTitulaires = require('../../sources/titres/h-titulaires.json')
const hTitresTitulaires = require('../../sources/titres/h-titres-titulaires.json')

const mTitulaires = require('../../sources/titres/m-titulaires.json')
const mTitresTitulaires = require('../../sources/titres/m-titres-titulaires.json')

const titulaires = [...dedup(gTitulaires, hTitulaires), ...mTitulaires]
const titresTitulaires = [
  ...gTitresTitulaires,
  ...findup(hTitresTitulaires, 'titulaireId', 'titreId'),
  ...mTitresTitulaires
]

exports.seed = (knex, Promise) =>
  Promise.all([knex('titulaires').del(), knex('titresTitulaires').del()])
    .then(() => knex('titulaires').insert(titulaires))
    .then(() => knex('titresTitulaires').insert(titresTitulaires))
