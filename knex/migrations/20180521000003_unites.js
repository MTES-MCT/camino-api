exports.up = knex => {
  return knex.schema
    .createTable('devises', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('geoSystemes', table => {
      table.string('id', 5).primary()
      table.string('nom').notNullable()
      table.string('unite', 8)
      table.string('zone')
      table.string('definitionProj4')
    })
    .createTable('volumeUnites', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('devises')
    .dropTable('geoSystemes')
    .dropTable('volumeUnites')
}
