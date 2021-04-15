exports.up = knex =>
  knex.schema
    .createTable('titresTravaux', table => {
      table.string('id', 128).primary()
      table
        .string('titreId', 128)
        .index()
        .references('titres.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .string('statutId', 3)
        .index()
        .references('demarchesStatuts.id')
        .defaultTo('ind')
      table.string('typeId', 3).index().references('travauxTypes.id')
      table.integer('ordre')
    })
    .createTable('titresTravauxEtapes', table => {
      table.string('id').primary()
      table
        .string('titreTravauxId', 128)
        .index()
        .references('titresTravaux.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('statutId', 3).index().references('etapesStatuts.id')
      table
        .string('typeId', 3)
        .index()
        .references('travauxEtapesTypes.id')
        .notNullable()
      table.string('date', 10)
      table.integer('duree')
      table.float('surface')
      table.jsonb('contenu')
      table.integer('ordre')
    })

exports.down = knex => knex.schema.dropTable('titresActivites')
