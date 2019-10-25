exports.up = knex => {
  return knex.schema
    .createTable('frequences', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('periodesNom')
    })
    .createTable('trimestres', table => {
      table.integer('id', 1).primary()
      table.string('nom').notNullable()
      table.string('frequenceId', 3).references('frequences.id')
    })
    .createTable('mois', table => {
      table.integer('id', 2).primary()
      table.string('nom').notNullable()
      table.string('frequenceId', 3).references('frequences.id')
      table.integer('trimestreId', 1).references('trimestres.id')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('mois')
    .dropTable('trimestres')
    .dropTable('frequences')
}
