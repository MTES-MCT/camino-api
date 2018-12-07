const dateFormat = require('dateformat')
const titresTravauxRapports = require('../../sources/titres-travaux-rapports.json')

exports.seed = (knex, Promise) =>
  knex('titresTravauxRapports')
    .del()
    .then(() =>
      knex('titresTravauxRapports').insert(
        titresTravauxRapports.map(tr => {
          tr.date = dateFormat(tr.date, 'yyyy-mm-dd')
          return tr
        })
      )
    )
