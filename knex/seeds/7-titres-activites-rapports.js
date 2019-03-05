const dateFormat = require('dateformat')
const titresActivites = require('../../sources/titres-activites.json')

exports.seed = (knex, Promise) =>
  knex('titresActivites')
    .del()
    .then(() =>
      knex('titresActivites').insert(
        titresActivites.map(tr => {
          tr.date = dateFormat(tr.date, 'yyyy-mm-dd')
          return tr
        })
      )
    )
