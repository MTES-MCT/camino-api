exports.up = async knex => {
  await knex.schema.table('demarchesTypes', table => {
    table.boolean('travaux')
  })

  await knex.schema.table('documents', table => {
    table.dropColumn('titre_travaux_etape_id')
  })

  await knex.schema.dropTable('titres_travaux_etapes')

  return knex.schema.dropTable('titres_travaux')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.down = knex => {
  // TODO
}
