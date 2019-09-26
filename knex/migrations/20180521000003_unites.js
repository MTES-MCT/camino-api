exports.up = knex =>
  knex.schema
    .createTable('devises', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('geoSystemes', table => {
      table.string('id', 5).primary()
      table.string('nom').notNullable()
      table.string('type', 10)
      table.string('zone')
      table.string('definitionProj4')
    })
    .createTable('unites', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('symbole').notNullable()
      table.string('type').notNullable()
    })

exports.down = knex =>
  knex.schema
    .dropTable('devises')
    .dropTable('geoSystemes')
    .dropTable('unites')
