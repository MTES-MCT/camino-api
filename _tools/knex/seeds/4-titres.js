const m = require('../../sources/titres-m.json')
const mDemarches = require('../../sources/titres-m-demarches.json')
const mEtapes = require('../../sources/titres-m-etapes.json')
const mEmprises = require('../../sources/titres-m-emprises.json')
const mPoints = require('../../sources/titres-m-points.json')
const mPointsReferences = require('../../sources/titres-m-points-references.json')
const mDocuments = require('../../sources/titres-m-documents.json')
const mSubstances = require('../../sources/titres-m-substances.json')
const mTitulaires = require('../../sources/titres-m-titulaires.json')
const mAmodiataires = require('../../sources/titres-m-amodiataires.json')
const mUtilisateurs = require('../../sources/titres-m-utilisateurs.json')
const mVerifications = require('../../sources/titres-m-verifications.json')

const m973 = require('../../sources/titres-m973.json')
const m973Demarches = require('../../sources/titres-m973-demarches.json')
const m973Etapes = require('../../sources/titres-m973-etapes.json')
const m973Emprises = require('../../sources/titres-m973-emprises.json')
const m973Points = require('../../sources/titres-m973-points.json')
const m973PointsReferences = require('../../sources/titres-m973-points-references.json')
const m973Documents = require('../../sources/titres-m973-documents.json')
const m973Substances = require('../../sources/titres-m973-substances.json')
const m973Titulaires = require('../../sources/titres-m973-titulaires.json')
const m973Amodiataires = require('../../sources/titres-m973-amodiataires.json')
const m973Utilisateurs = require('../../sources/titres-m973-utilisateurs.json')
const m973Verifications = require('../../sources/titres-m973-verifications.json')

const h = require('../../sources/titres-h.json')
const hDemarches = require('../../sources/titres-h-demarches.json')
const hEtapes = require('../../sources/titres-h-etapes.json')
const hEmprises = require('../../sources/titres-h-emprises.json')
const hPoints = require('../../sources/titres-h-points.json')
const hPointsReferences = require('../../sources/titres-h-points-references.json')
const hDocuments = require('../../sources/titres-h-documents.json')
const hSubstances = require('../../sources/titres-h-substances.json')
const hTitulaires = require('../../sources/titres-h-titulaires.json')
const hAmodiataires = require('../../sources/titres-h-amodiataires.json')
const hUtilisateurs = require('../../sources/titres-h-utilisateurs.json')
const hVerifications = require('../../sources/titres-h-verifications.json')

const s = require('../../sources/titres-s.json')
const sDemarches = require('../../sources/titres-s-demarches.json')
const sEtapes = require('../../sources/titres-s-etapes.json')
const sEmprises = require('../../sources/titres-s-emprises.json')
const sPoints = require('../../sources/titres-s-points.json')
const sPointsReferences = require('../../sources/titres-s-points-references.json')
const sDocuments = require('../../sources/titres-s-documents.json')
const sSubstances = require('../../sources/titres-s-substances.json')
const sTitulaires = require('../../sources/titres-s-titulaires.json')
const sAmodiataires = require('../../sources/titres-s-amodiataires.json')
const sUtilisateurs = require('../../sources/titres-s-utilisateurs.json')
const sVerifications = require('../../sources/titres-s-verifications.json')

const c = require('../../sources/titres-c.json')
const cDemarches = require('../../sources/titres-c-demarches.json')
const cEtapes = require('../../sources/titres-c-etapes.json')
const cEmprises = require('../../sources/titres-c-emprises.json')
const cPoints = require('../../sources/titres-c-points.json')
const cPointsReferences = require('../../sources/titres-c-points-references.json')
const cDocuments = require('../../sources/titres-c-documents.json')
const cSubstances = require('../../sources/titres-c-substances.json')
const cTitulaires = require('../../sources/titres-c-titulaires.json')
const cAmodiataires = require('../../sources/titres-c-amodiataires.json')
const cUtilisateurs = require('../../sources/titres-c-utilisateurs.json')
const cVerifications = require('../../sources/titres-c-verifications.json')

const g = require('../../sources/titres-g.json')
const gDemarches = require('../../sources/titres-g-demarches.json')
const gEtapes = require('../../sources/titres-g-etapes.json')
const gEmprises = require('../../sources/titres-g-emprises.json')
const gPoints = require('../../sources/titres-g-points.json')
const gPointsReferences = require('../../sources/titres-g-points-references.json')
const gDocuments = require('../../sources/titres-g-documents.json')
const gSubstances = require('../../sources/titres-g-substances.json')
const gTitulaires = require('../../sources/titres-g-titulaires.json')
const gAmodiataires = require('../../sources/titres-g-amodiataires.json')
const gUtilisateurs = require('../../sources/titres-g-utilisateurs.json')
const gVerifications = require('../../sources/titres-g-verifications.json')

const a = require('../../sources/titres-a.json')
const aDemarches = require('../../sources/titres-a-demarches.json')
const aEtapes = require('../../sources/titres-a-etapes.json')
const aEmprises = require('../../sources/titres-a-emprises.json')
const aPoints = require('../../sources/titres-a-points.json')
const aPointsReferences = require('../../sources/titres-a-points-references.json')
const aDocuments = require('../../sources/titres-a-documents.json')
const aSubstances = require('../../sources/titres-a-substances.json')
const aTitulaires = require('../../sources/titres-a-titulaires.json')
const aAmodiataires = require('../../sources/titres-a-amodiataires.json')
const aUtilisateurs = require('../../sources/titres-a-utilisateurs.json')
const aVerifications = require('../../sources/titres-a-verifications.json')

const w = require('../../sources/titres-w.json')
const wDemarches = require('../../sources/titres-w-demarches.json')
const wEtapes = require('../../sources/titres-w-etapes.json')
const wEmprises = require('../../sources/titres-w-emprises.json')
const wPoints = require('../../sources/titres-w-points.json')
const wPointsReferences = require('../../sources/titres-w-points-references.json')
const wDocuments = require('../../sources/titres-w-documents.json')
const wSubstances = require('../../sources/titres-w-substances.json')
const wTitulaires = require('../../sources/titres-w-titulaires.json')
const wAmodiataires = require('../../sources/titres-w-amodiataires.json')
const wUtilisateurs = require('../../sources/titres-w-utilisateurs.json')
const wVerifications = require('../../sources/titres-w-verifications.json')

const f = require('../../sources/titres-f.json')
const fDemarches = require('../../sources/titres-f-demarches.json')
const fEtapes = require('../../sources/titres-f-etapes.json')
const fEmprises = require('../../sources/titres-f-emprises.json')
const fPoints = require('../../sources/titres-f-points.json')
const fPointsReferences = require('../../sources/titres-f-points-references.json')
const fDocuments = require('../../sources/titres-f-documents.json')
const fSubstances = require('../../sources/titres-f-substances.json')
const fTitulaires = require('../../sources/titres-f-titulaires.json')
const fAmodiataires = require('../../sources/titres-f-amodiataires.json')
const fUtilisateurs = require('../../sources/titres-f-utilisateurs.json')
const fVerifications = require('../../sources/titres-f-verifications.json')

const titres = [...m, ...m973, ...h, ...s, ...c, ...g, ...a, ...w, ...f]

const titresDemarches = [
  ...mDemarches,
  ...m973Demarches,
  ...hDemarches,
  ...sDemarches,
  ...cDemarches,
  ...gDemarches,
  ...aDemarches,
  ...wDemarches,
  ...fDemarches
]

const titresEtapes = [
  ...mEtapes,
  ...m973Etapes,
  ...hEtapes,
  ...sEtapes,
  ...cEtapes,
  ...gEtapes,
  ...aEtapes,
  ...wEtapes,
  ...fEtapes
]

const titresSubstances = [
  ...mSubstances,
  ...m973Substances,
  ...hSubstances,
  ...sSubstances,
  ...cSubstances,
  ...gSubstances,
  ...aSubstances,
  ...wSubstances,
  ...fSubstances
]

const titresPoints = [
  ...mPoints,
  ...m973Points,
  ...hPoints,
  ...sPoints,
  ...cPoints,
  ...gPoints,
  ...aPoints,
  ...wPoints,
  ...fPoints
]

const titresPointsReferences = [
  ...mPointsReferences,
  ...m973PointsReferences,
  ...hPointsReferences,
  ...sPointsReferences,
  ...cPointsReferences,
  ...gPointsReferences,
  ...aPointsReferences,
  ...wPointsReferences,
  ...fPointsReferences
]

const titresDocuments = [
  ...mDocuments,
  ...m973Documents,
  ...hDocuments,
  ...sDocuments,
  ...cDocuments,
  ...gDocuments,
  ...aDocuments,
  ...wDocuments,
  ...fDocuments
]

const titresTitulaires = [
  ...mTitulaires,
  ...m973Titulaires,
  // ...hTitulaires,
  ...sTitulaires,
  // ...cTitulaires,
  ...gTitulaires,
  ...aTitulaires,
  ...wTitulaires,
  ...fTitulaires
]

const titresAmodiataires = [
  ...mAmodiataires,
  ...m973Amodiataires,
  ...hAmodiataires,
  ...sAmodiataires,
  ...cAmodiataires,
  ...gAmodiataires,
  ...aAmodiataires,
  ...wAmodiataires,
  ...fAmodiataires
]

const titresUtilisateurs = [
  ...mUtilisateurs,
  ...m973Utilisateurs,
  ...hUtilisateurs,
  ...sUtilisateurs,
  ...cUtilisateurs,
  ...gUtilisateurs,
  ...aUtilisateurs,
  ...wUtilisateurs,
  ...fUtilisateurs
]

const titresEmprises = [
  ...mEmprises,
  ...m973Emprises,
  ...hEmprises,
  ...sEmprises,
  ...cEmprises,
  ...gEmprises,
  ...aEmprises,
  ...wEmprises,
  ...fEmprises
]

const titresVerifications = [
  ...mVerifications,
  ...m973Verifications,
  ...hVerifications,
  ...sVerifications,
  ...cVerifications,
  ...gVerifications,
  ...aVerifications,
  ...wVerifications,
  ...fVerifications
]

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titresEmprises').del(),
    knex('titresSubstances').del(),
    knex('titresPointsReferences').del(),
    knex('titresUtilisateurs').del(),
    knex('titresTitulaires').del(),
    knex('titresAmodiataires').del(),
    knex('titresVerifications').del(),
    knex('titresDocuments').del()
  ])
    .then(() => knex('titresPoints').del())
    .then(() => knex('titresEtapes').del())
    .then(() => knex('titresDemarches').del())
    .then(() => knex('titres').del())
    .then(() => knex('titres').insert(titres))
    .then(() => knex('titresDemarches').insert(titresDemarches))
    .then(() => knex('titresEtapes').insert(titresEtapes))
    .then(() =>
      Promise.all([
        knex('titresSubstances').insert(titresSubstances),
        knex('titresPoints').insert(titresPoints),
        knex('titresEmprises').insert(titresEmprises),
        knex('titresTitulaires').insert(titresTitulaires),
        knex('titresAmodiataires').insert(titresAmodiataires),
        knex('titresVerifications').insert(titresVerifications),
        knex('titresUtilisateurs').insert(titresUtilisateurs),
        knex('titresDocuments').insert(titresDocuments)
      ])
    )
    .then(() => knex('titresPointsReferences').insert(titresPointsReferences))
