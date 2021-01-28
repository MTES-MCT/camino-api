exports.up = knex =>
  knex.schema
    .createTable('devises', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
    })
    .createTable('unites', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('symbole').notNullable()
      table.string('referenceUniteId', 3).references('id')
      table.float('referenceRatio')
    })
    .createTable('geoSystemes', table => {
      table.string('id', 5).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
      table.string('uniteId', 3).index().references('unites.id').notNullable()
      table.string('zone')
      table.string('definitionProj4')
    })
    .createTable('referencesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })

exports.down = knex =>
  knex.schema
    .dropTable('devises')
    .dropTable('geoSystemes')
    .dropTable('unites')
    .dropTable('referencesTypes')
