const m = require('../../sources/titres_m.json')
const mDemarches = require('../../sources/titres_m_demarches.json')
const mEtapes = require('../../sources/titres_m_etapes.json')
const mEmprises = require('../../sources/titres_m_emprises.json')
const mPoints = require('../../sources/titres_m_points.json')
const mSubstances = require('../../sources/titres_m_substances.json')
const mTitulaires = require('../../sources/titres_m_titulaires.json')
const mAmodiataires = require('../../sources/titres_m_amodiataires.json')
const mUtilisateurs = require('../../sources/titres_m_utilisateurs.json')

const m973 = require('../../sources/titres_m973.json')
const m973Demarches = require('../../sources/titres_m973_demarches.json')
const m973Etapes = require('../../sources/titres_m973_etapes.json')
const m973Emprises = require('../../sources/titres_m973_emprises.json')
const m973Points = require('../../sources/titres_m973_points.json')
const m973Substances = require('../../sources/titres_m973_substances.json')
const m973Titulaires = require('../../sources/titres_m973_titulaires.json')
const m973Amodiataires = require('../../sources/titres_m973_amodiataires.json')
const m973Utilisateurs = require('../../sources/titres_m973_utilisateurs.json')

const h = require('../../sources/titres_h.json')
const hDemarches = require('../../sources/titres_h_demarches.json')
const hEtapes = require('../../sources/titres_h_etapes.json')
const hEmprises = require('../../sources/titres_h_emprises.json')
const hPoints = require('../../sources/titres_h_points.json')
const hSubstances = require('../../sources/titres_h_substances.json')
const hTitulaires = require('../../sources/titres_h_titulaires.json')
const hAmodiataires = require('../../sources/titres_h_amodiataires.json')
const hUtilisateurs = require('../../sources/titres_h_utilisateurs.json')

const s = require('../../sources/titres_s.json')
const sDemarches = require('../../sources/titres_s_demarches.json')
const sEtapes = require('../../sources/titres_s_etapes.json')
const sEmprises = require('../../sources/titres_s_emprises.json')
const sPoints = require('../../sources/titres_s_points.json')
const sSubstances = require('../../sources/titres_s_substances.json')
const sTitulaires = require('../../sources/titres_s_titulaires.json')
const sAmodiataires = require('../../sources/titres_s_amodiataires.json')
const sUtilisateurs = require('../../sources/titres_s_utilisateurs.json')

const c = require('../../sources/titres_c.json')
const cDemarches = require('../../sources/titres_c_demarches.json')
const cEtapes = require('../../sources/titres_c_etapes.json')
const cEmprises = require('../../sources/titres_c_emprises.json')
const cPoints = require('../../sources/titres_c_points.json')
const cSubstances = require('../../sources/titres_c_substances.json')
const cTitulaires = require('../../sources/titres_c_titulaires.json')
const cAmodiataires = require('../../sources/titres_c_amodiataires.json')
const cUtilisateurs = require('../../sources/titres_c_utilisateurs.json')

const g = require('../../sources/titres_g.json')
const gDemarches = require('../../sources/titres_g_demarches.json')
const gEtapes = require('../../sources/titres_g_etapes.json')
const gEmprises = require('../../sources/titres_g_emprises.json')
const gPoints = require('../../sources/titres_g_points.json')
const gSubstances = require('../../sources/titres_g_substances.json')
const gTitulaires = require('../../sources/titres_g_titulaires.json')
const gAmodiataires = require('../../sources/titres_g_amodiataires.json')
const gUtilisateurs = require('../../sources/titres_g_utilisateurs.json')

const a = require('../../sources/titres_a.json')
const aDemarches = require('../../sources/titres_a_demarches.json')
const aEtapes = require('../../sources/titres_a_etapes.json')
const aEmprises = require('../../sources/titres_a_emprises.json')
const aPoints = require('../../sources/titres_a_points.json')
const aSubstances = require('../../sources/titres_a_substances.json')
const aTitulaires = require('../../sources/titres_a_titulaires.json')
const aAmodiataires = require('../../sources/titres_a_amodiataires.json')
const aUtilisateurs = require('../../sources/titres_a_utilisateurs.json')

const w = require('../../sources/titres_w.json')
const wDemarches = require('../../sources/titres_w_demarches.json')
const wEtapes = require('../../sources/titres_w_etapes.json')
const wEmprises = require('../../sources/titres_w_emprises.json')
const wPoints = require('../../sources/titres_w_points.json')
const wSubstances = require('../../sources/titres_w_substances.json')
const wTitulaires = require('../../sources/titres_w_titulaires.json')
const wAmodiataires = require('../../sources/titres_w_amodiataires.json')
const wUtilisateurs = require('../../sources/titres_w_utilisateurs.json')

const titres = [...m, ...m973, ...h, ...s, ...c, ...g, ...a, ...w]
const titresDemarches = [
  ...mDemarches,
  ...m973Demarches,
  ...hDemarches,
  ...sDemarches,
  ...cDemarches,
  ...gDemarches,
  ...aDemarches,
  ...wDemarches
]
const titresEtapes = [
  ...mEtapes,
  ...m973Etapes,
  ...hEtapes,
  ...sEtapes,
  ...cEtapes,
  ...gEtapes,
  ...aEtapes,
  ...wEtapes
]
const titresSubstances = [
  ...mSubstances,
  ...m973Substances,
  ...hSubstances,
  ...sSubstances,
  ...cSubstances,
  ...gSubstances,
  ...aSubstances,
  ...wSubstances
]
const titresPoints = [
  ...mPoints,
  ...m973Points,
  ...hPoints,
  ...sPoints,
  ...cPoints,
  ...gPoints,
  ...aPoints,
  ...wPoints
]
const titresTitulaires = [
  ...mTitulaires,
  ...m973Titulaires,
  ...hTitulaires,
  ...sTitulaires,
  ...cTitulaires,
  ...gTitulaires,
  ...aTitulaires,
  ...wTitulaires
]
const titresAmodiataires = [
  ...mAmodiataires,
  ...m973Amodiataires,
  ...hAmodiataires,
  ...sAmodiataires,
  ...cAmodiataires,
  ...gAmodiataires,
  ...aAmodiataires,
  ...wAmodiataires
]
const titresUtilisateurs = [
  ...mUtilisateurs,
  ...m973Utilisateurs,
  ...hUtilisateurs,
  ...sUtilisateurs,
  ...cUtilisateurs,
  ...gUtilisateurs,
  ...aUtilisateurs,
  ...wUtilisateurs
]
const titresEmprises = [
  ...mEmprises,
  ...m973Emprises,
  ...hEmprises,
  ...sEmprises,
  ...cEmprises,
  ...gEmprises,
  ...aEmprises,
  ...wEmprises
]

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
