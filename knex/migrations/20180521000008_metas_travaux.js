exports.up = knex =>
  knex.schema
    .createTable('travauxTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('travauxEtapesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom', 128)
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('travauxTypes__travauxEtapesTypes', table => {
      table
        .string('travauxTypeId', 3)
        .index()
        .references('travauxTypes.id')
        .notNullable()
      table
        .string('travauxEtapeTypeId', 3)
        .index()
        .references('travauxEtapesTypes.id')
        .notNullable()
      table.integer('ordre').notNullable()
      table.primary(['travauxTypeId', 'travauxEtapeTypeId'])
    })
    .createTable('travauxEtapesTypes__etapesStatuts', table => {
      table
        .string('travauxEtapeTypeId', 3)
        .index()
        .references('travauxEtapesTypes.id')
        .notNullable()
      table
        .string('etapeStatutId', 3)
        .index()
        .references('etapesStatuts.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['travauxEtapeTypeId', 'etapeStatutId'])
    })

exports.down = knex =>
  knex.schema
    .dropTable('travauxEtapesTypes__etapesStatuts')
    .dropTable('travauxTypes__travauxEtapesTypes')
    .dropTable('travauxEtapesTypes')
    .dropTable('travauxTypes')
