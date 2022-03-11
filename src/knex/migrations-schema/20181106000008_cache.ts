import { Knex } from 'knex'

exports.up = async (knex: Knex) =>
  knex.schema.createTable('caches', table => {
    table.string('id', 128).primary()
    table.jsonb('valeur')
  })

exports.down = () => ({})
