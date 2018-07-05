const m = require('../../sources/titres/m/titres.json')
const mDemarches = require('../../sources/titres/m/titres_demarches.json')
const mEtapes = require('../../sources/titres/m/titres_etapes.json')
const mEmprises = require('../../sources/titres/m/titres_emprises.json')
const mPoints = require('../../sources/titres/m/titres_points.json')
const mSubstances = require('../../sources/titres/m/titres_substances.json')
const mTitulaires = require('../../sources/titres/m/titres_titulaires.json')
const mAmodiataires = require('../../sources/titres/m/titres_amodiataires.json')
const mUtilisateurs = require('../../sources/titres/m/titres_utilisateurs.json')

const m973 = require('../../sources/titres/m973/titres.json')
const m973Demarches = require('../../sources/titres/m973/titres_demarches.json')
const m973Etapes = require('../../sources/titres/m973/titres_etapes.json')
const m973Emprises = require('../../sources/titres/m973/titres_emprises.json')
const m973Points = require('../../sources/titres/m973/titres_points.json')
const m973Substances = require('../../sources/titres/m973/titres_substances.json')
const m973Titulaires = require('../../sources/titres/m973/titres_titulaires.json')
const m973Amodiataires = require('../../sources/titres/m973/titres_amodiataires.json')
const m973Utilisateurs = require('../../sources/titres/m973/titres_utilisateurs.json')

const h = require('../../sources/titres/h/titres.json')
const hDemarches = require('../../sources/titres/h/titres_demarches.json')
const hEtapes = require('../../sources/titres/h/titres_etapes.json')
const hEmprises = require('../../sources/titres/h/titres_emprises.json')
const hPoints = require('../../sources/titres/h/titres_points.json')
const hSubstances = require('../../sources/titres/h/titres_substances.json')
const hTitulaires = require('../../sources/titres/h/titres_titulaires.json')
const hAmodiataires = require('../../sources/titres/h/titres_amodiataires.json')
const hUtilisateurs = require('../../sources/titres/h/titres_utilisateurs.json')

const titres = [...m, ...m973, ...h]
const titresDemarches = [...mDemarches, ...m973Demarches, ...hDemarches]
const titresEtapes = [...mEtapes, ...m973Etapes, ...hEtapes]
const titresSubstances = [...mSubstances, ...m973Substances, ...hSubstances]
const titresPoints = [...mPoints, ...m973Points, ...hPoints]
const titresTitulaires = [...mTitulaires, ...m973Titulaires, ...hTitulaires]
const titresAmodiataires = [
  ...mAmodiataires,
  ...m973Amodiataires,
  ...hAmodiataires
]
const titresUtilisateurs = [
  ...mUtilisateurs,
  ...m973Utilisateurs,
  ...hUtilisateurs
]
const titresEmprises = [...mEmprises, ...m973Emprises, ...hEmprises]

exports.seed = (knex, Promise) =>
  knex('titres')
    .insert(titres)
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
