exports.up = knex =>
  knex.schema
    .createTable('travauxTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('travauxTypes__etapesTypes', table => {
      table
        .string('travauxTypeId', 3)
        .index()
        .references('travauxTypes.id')
        .notNullable()
      table
        .string('etapeTypeId', 3)
        .index()
        .references('etapesTypes.id')
        .notNullable()
      table.specificType('sections', 'jsonb[]')
      table.integer('ordre').notNullable()
      table.primary(['travauxTypeId', 'etapeTypeId'])
    })

exports.down = knex =>
  knex.schema.dropTable('travauxTypes__etapesTypes').dropTable('travauxTypes')
