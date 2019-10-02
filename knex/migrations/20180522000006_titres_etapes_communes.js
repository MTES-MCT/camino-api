exports.up = knex =>
  knex.schema.createTable('titresCommunes', table => {
    table.string('titreEtapeId', 128).notNullable()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .string('communeId', 8)
      .notNullable()
      .references('communes.id')
    table.integer('surface')
    table.primary(['titreEtapeId', 'communeId'])
    table.index('titreEtapeId')
    table.index('communeId')
  })

exports.down = knex => knex.schema.dropTable('titresCommunes')
