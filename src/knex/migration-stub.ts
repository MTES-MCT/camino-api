import { Knex } from 'knex'

exports.up = (knex: Knex) =>
  knex.schema.createTable('matable', table => {
    table.string('id').primary()
  })

exports.down = () => ({})
