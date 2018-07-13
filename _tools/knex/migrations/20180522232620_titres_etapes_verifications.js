exports.up = knex => {
  return knex.schema
    .createTable('verifications', table => {
      table.enum('id', ['ver', 'err', 'inc']).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('titresVerifications', table => {
      table
        .string('titreEtape_id', 128)
        .primary()
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.boolean('date')
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
  return knex.schema.dropTable('titresVerifications').dropTable('verifications')
}
