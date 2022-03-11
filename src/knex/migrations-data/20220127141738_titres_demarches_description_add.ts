import { Knex } from 'knex'

exports.up = async (knex: Knex) =>
  knex.schema.alterTable('titres_demarches', function (table) {
    table.string('description').nullable()
  })

exports.down = () => ({})
