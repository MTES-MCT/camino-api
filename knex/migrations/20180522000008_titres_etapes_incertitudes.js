exports.up = knex => {
  return knex.schema.createTable('titresIncertitudes', table => {
    table.string('titreEtapeId', 128).primary()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table.boolean('date')
    table.boolean('dateDebut')
    table.boolean('dateFin')
    table.boolean('duree')
    table.boolean('surface')
    table.boolean('points')
    table.boolean('substances')
    table.boolean('titulaires')
    table.boolean('amodiataires')
    table.boolean('administrations')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresIncertitudes')
}
