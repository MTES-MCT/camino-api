exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresStatuts', table => {
    table.enum('id', ['dmi', 'dmc', 'val', 'mdi', 'ech']).primary()
    table.string('nom', 32).notNullable()
    table.string('couleur', 16).notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresStatuts')
}
