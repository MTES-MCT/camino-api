exports.up = knex =>
  knex.schema
    .createTable('titresCommunes', table => {
      table.string('titreEtapeId', 128).notNullable().index()
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('communeId', 8)
        .notNullable()
        .index()
        .references('communes.id')
      table.integer('surface')
      table.primary(['titreEtapeId', 'communeId'])
    })
    .createTable('titresForets', table => {
      table.string('titreEtapeId', 128).notNullable().index()
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('foretId', 8).notNullable().index().references('forets.id')
      table.integer('surface')
      table.primary(['titreEtapeId', 'foretId'])
    })

exports.down = knex =>
  knex.schema.dropTable('titresCommunes').dropTable('titresForets')
