exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('titres_substances', table => {
      table.string('titre_id', 32).references('titres.id')
      table.string('substance_id', 4).references('substances.id')
      table.primary(['titre_id', 'substance_id'])
      table.boolean('connexe')
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('titres_substances')])
}
