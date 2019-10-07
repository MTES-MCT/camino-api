exports.up = knex =>
  knex.schema
    .createTable('devises', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('unites', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('symbole').notNullable()
    })
    .createTable('geoSystemes', table => {
      table.string('id', 5).primary()
      table.string('nom').notNullable()
      table
        .string('uniteId', 3)
        .references('unites.id')
        .notNullable()
      table.string('zone')
      table.string('definitionProj4')
    })

exports.down = knex =>
  knex.schema
    .dropTable('devises')
    .dropTable('geoSystemes')
    .dropTable('unites')
