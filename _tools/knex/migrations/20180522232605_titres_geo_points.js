exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresGeoPoints', table => {
    table.string('id').primary()
    table
      .string('titrePhaseId', 128)
      .notNullable()
      .references('titresPhases.id')
      .onDelete('CASCADE')
    table.specificType('coordonees', 'POINT').notNullable()
    table.integer('groupe').notNullable()
    table.integer('contour').notNullable()
    table.integer('point').notNullable()
    table.string('nom').notNullable()
    table.string('reference')
    table.specificType('referenceValeur', 'float[]')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresGeoPoints')
}
