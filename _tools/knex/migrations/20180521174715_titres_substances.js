exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('titresSubstances', table => {
      table.string('titreId', 32).references('titres.id')
      table.string('substanceId', 4).references('substances.id')
      table.primary(['titreId', 'substanceId'])
      table.boolean('connexe')
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('titresSubstances')])
}
