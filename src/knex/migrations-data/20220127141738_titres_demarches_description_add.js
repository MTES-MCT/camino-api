exports.up = knex =>
  knex.schema.alterTable('titres_demarches', function (table) {
    table.string('description').nullable()
  })

exports.down = () => ({})
