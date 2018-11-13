exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresSubstances', table => {
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('substanceId', 4)
        .references('substances.id')
        .notNullable()
      table.boolean('connexe')
      table.integer('ordre')
      table.primary(['titreEtapeId', 'substanceId'])
    })
    .createTable('titresEmprises', table => {
      table
        .string('titreEtapeId', 128)
        .notNullable()
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('empriseId', 3)
        .notNullable()
        .references('emprises.id')
      table.primary(['titreEtapeId', 'empriseId'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresSubstances').dropTable('titresEmprises')
}
