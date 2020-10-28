exports.up = knex =>
  knex.schema
    .createTable('domaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('titresTypesTypes', table => {
      table.string('id', 2).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.boolean('exploitation')
      table.integer('ordre').notNullable()
    })
    .createTable('titresTypes', table => {
      table.string('id', 3).primary().notNullable()
      table
        .string('domaineId', 1)
        .index()
        .references('domaines.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .index()
        .references('titresTypesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.specificType('props_etapes_types', 'jsonb[]')
      table.boolean('archive')
      table.unique(['domaineId', 'typeId'])
    })
    .createTable('titres_statuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.text('description')
      table.string('couleur', 16).notNullable()
      table.integer('ordre')
    })
    .createTable('titresTypes__titresStatuts', table => {
      table
        .string('titreTypeId')
        .index()
        .references('titresTypes.id')
        .notNullable()
      table
        .string('titreStatutId')
        .index()
        .references('titresStatuts.id')
        .notNullable()
      table.boolean('publicLecture').notNullable()
      table.primary(['titreTypeId', 'titreStatutId'])
    })

exports.down = knex =>
  knex.schema
    .dropTable('titresTypesTypes')
    .dropTable('domaines')
    .dropTable('titresTypes__titresStatuts')
    .dropTable('titresTypes')
    .dropTable('titresStatuts')
