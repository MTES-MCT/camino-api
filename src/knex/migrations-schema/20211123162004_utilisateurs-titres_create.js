exports.up = knex =>
  knex.schema.createTable('utilisateurs__titres', table => {
    table
      .string('utilisateurId')
      .index()
      .references('utilisateurs.id')
      .onDelete('CASCADE')
    table.string('titreId').index().references('titres.id').onDelete('CASCADE')
    table.primary(['utilisateurId', 'titreId'])
  })

exports.down = knex => knex.schema.dropTable('utilisateurs__titres')
