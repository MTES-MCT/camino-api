import { Knex } from 'knex'

exports.up = async (knex: Knex) =>
  knex.schema.createTable('globales', table => {
    table.string('id').primary()
    table.boolean('valeur').notNullable()
  })

exports.down = () => ({})
