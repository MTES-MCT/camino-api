exports.up = knex =>
  knex.schema
    .createTable('domaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
      table.string('description')
      table.integer('ordre').notNullable()
    })
    .createTable('titresTypesTypes', table => {
      table.string('id', 2).primary()
      table.string('nom').notNullable()
      table.string('description')
      table.integer('ordre').notNullable()
    })
    .createTable('titresTypes', table => {
      table
        .string('id', 3)
        .primary()
        .notNullable()
      table
        .string('domaineId', 1)
        .references('domaines.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
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
      table.string('description')
      table.string('couleur', 16).notNullable()
      table.integer('ordre')
    })

exports.down = knex =>
  knex.schema
    .dropTable('titresTypesTypes')
    .dropTable('domaines')
    .dropTable('titresTypes')
    .dropTable('titresStatuts')
