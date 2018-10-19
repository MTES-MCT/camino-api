const entreprisesC = require('../../sources/repertoire-entreprises-c.json')
const entreprisesF = require('../../sources/repertoire-entreprises-f.json')
const entreprisesG = require('../../sources/repertoire-entreprises-g.json')
const entreprisesH = require('../../sources/repertoire-entreprises-h.json')
const entreprisesM = require('../../sources/repertoire-entreprises-m.json')
const entreprisesM973 = require('../../sources/repertoire-entreprises-m973.json')
const entreprisesR = require('../../sources/repertoire-entreprises-r.json')
const entreprisesS = require('../../sources/repertoire-entreprises-s.json')
const entreprisesW = require('../../sources/repertoire-entreprises-w.json')
const administrations = require('../../sources/repertoire-administrations.json')

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
