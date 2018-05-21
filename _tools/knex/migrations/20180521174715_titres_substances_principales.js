exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('titresSubstancesPrincipales', table => {
      table.string('titreId', 32).references('titres.id')
      table.string('substanceId', 4).references('substances.id')
      table.primary(['titreId', 'substanceId'])
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('titresSubstances')])
}
