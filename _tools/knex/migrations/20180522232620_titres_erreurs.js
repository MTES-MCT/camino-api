exports.up = knex => {
  return knex.schema.createTable('titresErreurs', table => {
    table
      .string('titreEtapeId', 128)
      .primary()
      .references('titresEtapes.id')
      .onDelete('CASCADE')
    table.boolean('date')
    table.boolean('dateDebut')
    table.boolean('dateFin')
    table.boolean('duree')
    table.boolean('surface')
    table.boolean('points')
    table.boolean('pointsSecurite')
    table.boolean('substances')
    table.boolean('titulaires')
    table.boolean('amodiataires')
    table.boolean('administrations')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresErreurs')
}
