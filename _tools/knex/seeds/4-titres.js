const m = require('../../sources/titres/m/titres.json')
const mDemarches = require('../../sources/titres/m/titres_demarches.json')
const mEtapes = require('../../sources/titres/m/titres_etapes.json')
const mEmprises = require('../../sources/titres/m/titres_emprises.json')
const mPoints = require('../../sources/titres/m/titres_points.json')
const mSubstances = require('../../sources/titres/m/titres_substances.json')
const mTitulaires = require('../../sources/titres/m/titres_titulaires.json')

const titres = [...m]
const titresDemarches = [...mDemarches]
const titresEtapes = [...mEtapes]
const titresSubstances = [...mSubstances]
const titresPoints = [...mPoints]
const titresTitulaires = [...mTitulaires]
const titresEmprises = [...mEmprises]

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titres').del(),
    knex('titres_demarches').del(),
    knex('titres_etapes').del(),
    knex('titres_emprises').del(),
    knex('titres_points').del(),
    knex('titres_substances').del(),
    knex('titres_titulaires').del()
  ])
    .then(() => knex('titres').insert(titres))
    .then(() => knex('titres_demarches').insert(titresDemarches))
    .then(() => knex('titres_etapes').insert(titresEtapes))
    .then(() =>
      Promise.all([
        knex('titres_substances').insert(titresSubstances),
        knex('titres_points').insert(titresPoints),
        knex('titres_titulaires').insert(titresTitulaires),
        knex('titres_emprises').insert(titresEmprises)
      ])
    )
