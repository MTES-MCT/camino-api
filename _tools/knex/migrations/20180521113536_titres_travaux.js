exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('titres_travaux', table => {
      table.string('id', 3).primary()
      table.string('nom')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('titres_travaux')])
}
