import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  return knex.schema.table('titres_etapes', table => {
    table.specificType('decisions_annexes_sections', 'jsonb[]')
    table.json('decisions_annexes_contenu')
  })
}

exports.down = () => ({})
