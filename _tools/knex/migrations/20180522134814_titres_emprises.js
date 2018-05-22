exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresEmprises', table => {
    table.string('id', 3).primary()
    table.string('nom')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresEmprises')
}
