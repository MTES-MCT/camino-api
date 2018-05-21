exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('titres', table => {
      table.string('id', 32).primary()
      table.string('nom')
      table.string('type_id', 3)
      table.string('domaine_id', 1)
      table.string('statut_id', 3)
      table.string('travaux_id', 3)
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('titres')])
}
