exports.up = knex => {
  return knex.schema.createTable('titres', table => {
    table.string('id', 128).primary()
    table.string('nom').notNullable()
    table.string('type_id', 3).notNullable()
    table.string('domaine_id', 1).notNullable()
    table.string('statut_id', 3).notNullable()
    table.json('references')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titres')
}
