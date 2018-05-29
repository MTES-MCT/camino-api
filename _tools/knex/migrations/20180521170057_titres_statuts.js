exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresStatuts', table => {
    table.string('id', 3).primary()
    table.string('nom', 32).notNullable()
    table.string('couleur', 16).notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresStatuts')
}
