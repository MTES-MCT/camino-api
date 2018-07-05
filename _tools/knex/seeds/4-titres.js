const m = require('../../sources/titres/m/titres.json')
const mDemarches = require('../../sources/titres/m/titres_demarches.json')
const mEtapes = require('../../sources/titres/m/titres_etapes.json')
const mEmprises = require('../../sources/titres/m/titres_emprises.json')
const mPoints = require('../../sources/titres/m/titres_points.json')
const mSubstances = require('../../sources/titres/m/titres_substances.json')
const mTitulaires = require('../../sources/titres/m/titres_titulaires.json')
const mAmodiataires = require('../../sources/titres/m/titres_amodiataires.json')
const mUtilisateurs = require('../../sources/titres/m/titres_utilisateurs.json')

const h = require('../../sources/titres/h/titres.json')
const hDemarches = require('../../sources/titres/h/titres_demarches.json')
const hEtapes = require('../../sources/titres/h/titres_etapes.json')
const hEmprises = require('../../sources/titres/h/titres_emprises.json')
const hPoints = require('../../sources/titres/h/titres_points.json')
const hSubstances = require('../../sources/titres/h/titres_substances.json')
const hTitulaires = require('../../sources/titres/h/titres_titulaires.json')
const hAmodiataires = require('../../sources/titres/h/titres_amodiataires.json')
const hUtilisateurs = require('../../sources/titres/h/titres_utilisateurs.json')

const titres = [...m, ...h]
const titresDemarches = [...mDemarches, ...hDemarches]
const titresEtapes = [...mEtapes, ...hEtapes]
const titresSubstances = [...mSubstances, ...hSubstances]
const titresPoints = [...mPoints, ...hPoints]
const titresTitulaires = [...mTitulaires, ...hTitulaires]
const titresAmodiataires = [...mAmodiataires, ...hAmodiataires]
const titresUtilisateurs = [...mUtilisateurs, ...hUtilisateurs]
const titresEmprises = [...mEmprises, ...hEmprises]

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titres').del(),
    knex('titres_demarches').del(),
    knex('titres_etapes').del(),
    knex('titres_emprises').del(),
    knex('titres_points').del(),
    knex('titres_substances').del(),
    knex('titres_utilisateurs').del(),
    knex('titres_titulaires').del(),
    knex('titres_amodiataires').del()
  ])
    .then(() => knex('titres').insert(titres))
    .then(() => knex('titres_demarches').insert(titresDemarches))
    .then(() => knex('titres_etapes').insert(titresEtapes))
    .then(() =>
      Promise.all([
        knex('titres_substances').insert(titresSubstances),
        knex('titres_points').insert(titresPoints),
        knex('titres_emprises').insert(titresEmprises),
        knex('titres_titulaires').insert(titresTitulaires),
        knex('titres_amodiataires').insert(titresAmodiataires)
      ])
    )
    .then(() => knex('titres_utilisateurs').insert(titresUtilisateurs))
