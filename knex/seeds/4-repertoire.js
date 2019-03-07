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
  Promise.all([knex('entreprises').del(), knex('administrations').del()]).then(
    () =>
      Promise.all([
        knex('entreprises').insert(entr),
        knex('administrations').insert(administrations)
      ])
  )
