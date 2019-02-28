const dateFormat = require('dateformat')
const titresActivitesRapports = require('../../sources/titres-activites-rapports.json')

exports.seed = (knex, Promise) =>
  knex('titresActivitesRapports')
    .del()
    .then(() =>
      knex('titresActivitesRapports').insert(
        titresActivitesRapports.map(tr => {
          tr.date = dateFormat(tr.date, 'yyyy-mm-dd')
          return tr
        })
      )
    )
