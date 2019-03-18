const entreprisesC = require('../../sources/entreprises-titres-c.json')
const entreprisesF = require('../../sources/entreprises-titres-f.json')
const entreprisesG = require('../../sources/entreprises-titres-g.json')
const entreprisesH = require('../../sources/entreprises-titres-h.json')
const entreprisesM = require('../../sources/entreprises-titres-m.json')
const entreprisesM973 = require('../../sources/entreprises-titres-m973.json')
const entreprisesR = require('../../sources/entreprises-titres-r.json')
const entreprisesS = require('../../sources/entreprises-titres-s.json')
const entreprisesW = require('../../sources/entreprises-titres-w.json')
const administrations = require('../../sources/administrations.json')

const entreprisesCEtablissements = require('../../sources/entreprises-titres-c-etablissements.json')
const entreprisesFEtablissements = require('../../sources/entreprises-titres-f-etablissements.json')
const entreprisesGEtablissements = require('../../sources/entreprises-titres-g-etablissements.json')
const entreprisesHEtablissements = require('../../sources/entreprises-titres-h-etablissements.json')
const entreprisesMEtablissements = require('../../sources/entreprises-titres-m-etablissements.json')
const entreprisesM973Etablissements = require('../../sources/entreprises-titres-m973-etablissements.json')
const entreprisesREtablissements = require('../../sources/entreprises-titres-r-etablissements.json')
const entreprisesSEtablissements = require('../../sources/entreprises-titres-s-etablissements.json')
const entreprisesWEtablissements = require('../../sources/entreprises-titres-w-etablissements.json')

const entreprises = [
  ...entreprisesC,
  ...entreprisesF,
  ...entreprisesG,
  ...entreprisesH,
  ...entreprisesM,
  ...entreprisesM973,
  ...entreprisesR,
  ...entreprisesS,
  ...entreprisesW
]

const entreprisesEtablissements = [
  ...entreprisesCEtablissements,
  ...entreprisesFEtablissements,
  ...entreprisesGEtablissements,
  ...entreprisesHEtablissements,
  ...entreprisesMEtablissements,
  ...entreprisesM973Etablissements,
  ...entreprisesREtablissements,
  ...entreprisesSEtablissements,
  ...entreprisesWEtablissements
]

const findup = (array, key1) =>
  array.reduce((res, el) => {
    if (res.find(e => e[key1] === el[key1])) {
      console.log(
        'entreprise en doublon (à supprimer dans la source): ',
        el[key1],
        el
      )
      return res
    } else {
      return [...res, el]
    }
  }, [])

const entr = findup(entreprises, 'id')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('entreprisesEtablissements').del(),
    knex('administrations').del()
  ])
    .then(() => knex('entreprises').del())
    .then(() =>
      Promise.all([
        knex('entreprises').insert(entr),
        knex('administrations').insert(administrations)
      ])
    )
    .then(() =>
      knex('entreprisesEtablissements').insert(entreprisesEtablissements)
    )
