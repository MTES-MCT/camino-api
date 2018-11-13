const titresTravauxRapports = require('../../sources/titres-travaux-rapports.json')

exports.seed = (knex, Promise) =>
  knex('titresTravauxRapports')
    .del()
    .then(() => knex('titresTravauxRapports').insert(titresTravauxRapports))
