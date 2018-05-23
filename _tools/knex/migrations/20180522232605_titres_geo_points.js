exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresGeoPoints', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .notNullable()
      .references('titres.id')
    table.specificType('coordinates', 'points').notNullable()
    table.string('polygone', 32).notNullable()
    table.string('name')
    table.string('reference')
    table.string('referenceValeur')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresGeoPoints')
}
