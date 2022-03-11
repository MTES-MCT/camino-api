import { Knex } from 'knex'

exports.up = async (knex: Knex) =>
  knex.schema.createTable('utilisateurs__titres', table => {
    table
      .string('utilisateurId')
      .index()
      .references('utilisateurs.id')
      .onDelete('CASCADE')
    table.string('titreId').index().references('titres.id').onDelete('CASCADE')
    table.primary(['utilisateurId', 'titreId'])
  })

exports.down = () => ({})
